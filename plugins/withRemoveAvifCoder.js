const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * expo-image@1.0.0 depends on `SDWebImageAVIFCoder ~> 0.9.4`, whose Conversion.m
 * is written against the libavif 0.x C API. Modern CocoaPods resolves libavif
 * 1.x, which reorganized avifReformatState / removed avifImage.alphaRange, so
 * the AVIF coder no longer compiles. This app doesn't need AVIF, so we strip the
 * coder entirely:
 *   - remove the SDWebImageAVIFCoder dependency from ExpoImage.podspec
 *   - remove the `import` + coder registration from ImageModule.swift
 *
 * This is *also* done via a patch-package patch, but that only runs on
 * `npm install`. Doing it here as a dangerous mod means it is re-applied during
 * every `expo prebuild` (right before `pod install` reads the podspec), so the
 * fix can't be silently skipped. Both mechanisms are idempotent.
 */
const withRemoveAvifCoder = (config) => {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const imageRoot = path.join(
        cfg.modRequest.projectRoot,
        'node_modules',
        'expo-image',
        'ios'
      );
      const podspec = path.join(imageRoot, 'ExpoImage.podspec');
      const swift = path.join(imageRoot, 'ImageModule.swift');

      if (fs.existsSync(podspec)) {
        const before = fs.readFileSync(podspec, 'utf8');
        const after = before.replace(
          /^[ \t]*s\.dependency 'SDWebImageAVIFCoder'.*\r?\n/m,
          ''
        );
        if (after !== before) fs.writeFileSync(podspec, after);
      }

      if (fs.existsSync(swift)) {
        const before = fs.readFileSync(swift, 'utf8');
        const after = before
          .replace(/^import SDWebImageAVIFCoder[ \t]*\r?\n/m, '')
          .replace(
            /^[ \t]*SDImageCodersManager\.shared\.addCoder\(SDImageAVIFCoder\.shared\)[ \t]*\r?\n/m,
            ''
          );
        if (after !== before) fs.writeFileSync(swift, after);
      }

      return cfg;
    },
  ]);
};

module.exports = withRemoveAvifCoder;
