import { fireEvent, render, screen } from "@testing-library/react-native";

import { CommentType } from "../constants/types";
import Comment from "../features/Comment";

const nested: CommentType = {
    id: "c1a",
    author: "bob",
    body: "Nested reply",
    timestamp: 1700000000,
    score: 3,
    scoreHidden: false,
    collapsed: false,
    replies: [],
};

const comment: CommentType = {
    id: "c1",
    author: "alice",
    body: "Hello world",
    timestamp: 1700000000,
    score: 10,
    scoreHidden: false,
    collapsed: false,
    replies: [nested],
};

describe("Comment", () => {
    it("renders the author, body, and nested replies", () => {
        render(<Comment data={comment} />);

        expect(screen.getByText("alice")).toBeTruthy();
        expect(screen.getByText("Hello world")).toBeTruthy();
        expect(screen.getByText("Nested reply")).toBeTruthy();
    });

    it("toggles the expanded accessibility state when pressed", () => {
        render(<Comment data={comment} />);

        const button = screen.getByLabelText(/comment by alice/i);
        expect(button.props.accessibilityState.expanded).toBe(true);

        fireEvent.press(button);
        expect(button.props.accessibilityState.expanded).toBe(false);

        fireEvent.press(button);
        expect(button.props.accessibilityState.expanded).toBe(true);
    });

    it("starts collapsed when the data says so", () => {
        render(<Comment data={{ ...comment, id: "c9", collapsed: true }} />);

        const button = screen.getByLabelText(/comment by alice/i);
        expect(button.props.accessibilityState.expanded).toBe(false);
    });
});
