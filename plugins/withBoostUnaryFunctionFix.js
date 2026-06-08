const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Boost 1.76.0 (pinned by React Native 0.71.x) declares
 *   template <typename T> struct hash_base : std::unary_function<T, std::size_t> {};
 * in boost/container_hash/hash.hpp. `std::unary_function` was deprecated in
 * C++11 and removed in C++17, and modern Xcode/libc++ toolchains no longer
 * provide it, so RCT-Folly (which includes boost's string algorithms) fails to
 * compile with: "no template named 'unary_function' in namespace 'std'".
 *
 * The boost source is fetched by CocoaPods into ios/Pods/boost (not
 * node_modules), so it can't be handled by patch-package. Instead we inject a
 * snippet into the generated Podfile's existing `post_install` hook that
 * rewrites the offending line after the pod is downloaded. Dropping the
 * `std::unary_function` base class only removes the (deprecated) argument_type/
 * result_type typedefs, which RN/Folly don't rely on.
 */
const PATCH_SNIPPET = [
  '',
  '    # Injected by withBoostUnaryFunctionFix: boost 1.76 uses std::unary_function,',
  '    # which modern C++ toolchains have removed. Patch the header post-download.',
  "    boost_hash = File.join(installer.sandbox.root, 'boost', 'boost', 'container_hash', 'hash.hpp')",
  '    if File.exist?(boost_hash)',
  '      boost_contents = File.read(boost_hash)',
  "      boost_patched = boost_contents.gsub('struct hash_base : std::unary_function<T, std::size_t> {};', 'struct hash_base {};')",
  '      File.write(boost_hash, boost_patched) if boost_patched != boost_contents',
  '    end',
].join('\n');

const withBoostUnaryFunctionFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile'
      );
      let contents = fs.readFileSync(podfilePath, 'utf8');

      // Idempotent: skip if we've already injected the patch.
      if (!contents.includes('withBoostUnaryFunctionFix')) {
        contents = contents.replace(
          /post_install do \|installer\|/,
          (match) => `${match}\n${PATCH_SNIPPET}`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return cfg;
    },
  ]);
};

module.exports = withBoostUnaryFunctionFix;
