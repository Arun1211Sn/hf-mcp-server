/**
 * Settings service for the MCP server
 * Manages application settings like enabled search tools
 */

import { ALL_BUILTIN_TOOL_IDS } from '@llmindset/hf-mcp';
import { normalizeBuiltInTools } from './tool-normalizer.js';

// Define the settings types
export interface SpaceTool {
	_id: string;
	name: string;
	subdomain: string;
	emoji: string;
}

export interface AppSettings {
	builtInTools: string[];
	spaceTools: SpaceTool[];
}

// Default space tools (exported for reuse)
//
// FORK PATCH: pre-wire the Spaces we want available out-of-the-box in stdio/local
// mode (where there is no `gradio=` URL param to select them). `dynamic_space` is
// already enabled via ALL_BUILTIN_TOOL_IDS, so ANY other MCP-enabled Space can still
// be discovered + invoked at runtime — this list is just the always-on set.
// Subdomains verified via https://huggingface.co/api/spaces/<owner/space>.
export const DEFAULT_SPACE_TOOLS: SpaceTool[] = [
	{
		// gr1 — LTX ultra-fast distilled video
		_id: 'lightricks-ltx-video-distilled',
		name: 'Lightricks/ltx-video-distilled',
		subdomain: 'lightricks-ltx-video-distilled',
		emoji: '🎬',
	},
	{
		// gr2 — Z-Image Turbo (HF default)
		_id: '6931936f57adaf3524388f9c',
		name: 'mcp-tools/Z-Image-Turbo',
		subdomain: 'mcp-tools-z-image-turbo',
		emoji: '🖼️',
	},
	{
		// gr3 — LTX-2 Turbo (video + audio)
		_id: 'alexnasa-ltx-2-turbo',
		name: 'alexnasa/ltx-2-TURBO',
		subdomain: 'alexnasa-ltx-2-turbo',
		emoji: '🎥',
	},

	// Add more always-on Spaces here, e.g.:
	// { _id: 'evalstate-flux1-schnell', name: 'evalstate/flux1_schnell', subdomain: 'evalstate-flux1-schnell', emoji: '🏎️💨' },
];

// Default settings
const defaultSettings: AppSettings = {
	builtInTools: normalizeBuiltInTools([...ALL_BUILTIN_TOOL_IDS]),
	spaceTools: [...DEFAULT_SPACE_TOOLS],
};

// In-memory settings store (could be replaced with persistence later)
let settings: AppSettings = { ...defaultSettings };

/** only used in local mode */
export const settingsService = {
	/**
	 * Get all application settings
	 */
	getSettings(): AppSettings {
		return { ...settings };
	},

	/**
	 * Update built-in tools array
	 */
	updateBuiltInTools(builtInTools: string[]): AppSettings {
		const normalized = normalizeBuiltInTools(builtInTools);
		settings = {
			...settings,
			builtInTools: [...normalized],
		};
		return { ...settings };
	},

	/**
	 * Update space tools array
	 */
	updateSpaceTools(spaceTools: SpaceTool[]): AppSettings {
		settings = {
			...settings,
			spaceTools: [...spaceTools],
		};
		return { ...settings };
	},

	/**
	 * Reset all settings to default values
	 */
	resetSettings(): AppSettings {
		settings = { ...defaultSettings };
		return { ...settings };
	},

	/**
	 * Check if a tool is enabled
	 */
	isToolEnabled(toolId: string): boolean {
		return settings.builtInTools.includes(toolId);
	},
};
