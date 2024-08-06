import { getHighlighter } from "shiki"
import { SHIKI_LANGUAGES_TO_LOAD } from "./constants"

export let highlighter: Awaited<ReturnType<typeof getHighlighter>> | null = null

export async function loadHighlighter() {
	highlighter = highlighter ?? await getHighlighter({
		themes: ['dracula', 'vitesse-dark', 'vitesse-light'],
		langs: SHIKI_LANGUAGES_TO_LOAD
	})
}
