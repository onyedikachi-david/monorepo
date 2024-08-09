import { describe, it, expect } from "vitest"
import { compileMessage } from "./compileMessage.js"
import type { Message } from "@inlang/sdk/v2"

describe("compileMessage", () => {
	it("compiles a message with variants", () => {
		const msg: Message = {
			locale: "en",
			id: "some_message",
			declarations: [
				{
					type: "input",
					name: "fistInput",
					value: { type: "expression", arg: { type: "variable", name: "fistInput" } },
				},
				{
					type: "input",
					name: "secondInput",
					value: { type: "expression", arg: { type: "variable", name: "second Input" } },
				},
			],
			selectors: [
				{ type: "expression", arg: { type: "variable", name: "fistInput" } },
				{
					type: "expression",
					arg: { type: "variable", name: "second Input" },
					annotation: { type: "function", name: "plural", options: [] },
				},
			],
			variants: [
				{
					id: "1",
					match: ["1", "2"],
					pattern: [{ type: "text", value: "One" }],
				},
				{
					id: "2",
					match: ["*", "*"],
					pattern: [{ type: "text", value: "Many" }],
				},
			],
		}

		const compiled = compileMessage(msg)
		expect(compiled.typeRestrictions).toEqual({
			"second Input": "number",
		})
		expect(compiled.code).toMatchInlineSnapshot()
	})
})
