const { atom } = require("recoil");

export const postsState = atom({
	key: "postsState",
	default: {},
});

export const currentNoteState = atom({
	key: "currentNoteState",
	default: -1,
});

export const currentUserState = atom({
	key: "currentUserState",
	default: {},
});

export const windowDimensionsState = atom({
	key: "windowDimensionsState",
	default: { width: 0, height: 0 },
});

export const isEditModeState = atom({
	key: "isEditModeState",
	default: false,
});
