#!/usr/bin/env node
/**
 * server.mjs — Canva Tools MCP Server
 * Tools: duplicate_design
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getAccessToken } from './auth.mjs';

const server = new McpServer({
  name: 'canva-tools',
  version: '1.0.0',
});

server.tool(
  'duplicate_design',
  'Duplicate a Canva design and return the new design_id and edit_url',
  {
    source_design_id: z.string().describe('Design ID of the master template to duplicate'),
    title: z.string().optional().describe('Title for the new design copy'),
  },
  async ({ source_design_id, title }) => {
    const token = await getAccessToken();

    const body = { design_id: source_design_id };
    if (title) body.title = title;

    const res = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Canva API error (${res.status}): ${JSON.stringify(data)}`);
    }

    const design = data.design ?? data;
    const result = {
      design_id: design.id ?? design.design_id,
      edit_url: design.urls?.edit_url ?? design.edit_url ?? '(not returned)',
      title: design.title,
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
