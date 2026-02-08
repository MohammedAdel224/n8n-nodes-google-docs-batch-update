import { INodePropertyOptions } from "n8n-workflow";

export const bulletGlyphPreset: INodePropertyOptions[] = [
    {
        name: 'BULLET_DISC_CIRCLE_SQUARE',
        value: 'BULLET_DISC_CIRCLE_SQUARE',
        description: 'A bulleted list with a DISC, CIRCLE and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_DIAMONDX_ARROW3D_SQUARE',
        value: 'BULLET_DIAMONDX_ARROW3D_SQUARE',
        description: 'A bulleted list with a DIAMONDX, ARROW3D and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_CHECKBOX',
        value: 'BULLET_CHECKBOX',
        description: 'A bulleted list with CHECKBOX bullet glyphs for all list nesting levels'
    },
    {
        name: 'BULLET_ARROW_DIAMOND_DISC',
        value: 'BULLET_ARROW_DIAMOND_DISC',
        description: 'A bulleted list with a ARROW, DIAMOND and DISC bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_STAR_CIRCLE_SQUARE',
        value: 'BULLET_STAR_CIRCLE_SQUARE',
        description: 'A bulleted list with a STAR, CIRCLE and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_ARROW3D_CIRCLE_SQUARE',
        value: 'BULLET_ARROW3D_CIRCLE_SQUARE',
        description: 'A bulleted list with a ARROW3D, CIRCLE and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_LEFTTRIANGLE_DIAMOND_DISC',
        value: 'BULLET_LEFTTRIANGLE_DIAMOND_DISC',
        description: 'A bulleted list with a LEFTTRIANGLE, DIAMOND and DISC bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE',
        value: 'BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE',
        description: 'A bulleted list with a DIAMONDX, HOLLOWDIAMOND and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'BULLET_DIAMOND_CIRCLE_SQUARE',
        value: 'BULLET_DIAMOND_CIRCLE_SQUARE',
        description: 'A bulleted list with a DIAMOND, CIRCLE and SQUARE bullet glyph for the first 3 list nesting levels'
    },
    {
        name: 'NUMBERED_DECIMAL_ALPHA_ROMAN',
        value: 'NUMBERED_DECIMAL_ALPHA_ROMAN',
        description: 'A numbered list with DECIMAL, ALPHA and ROMAN numeric glyphs for the first 3 list nesting levels, followed by periods'
    },
    {
        name: 'NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS',
        value: 'NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS',
        description: 'A numbered list with DECIMAL, ALPHA and ROMAN numeric glyphs for the first 3 list nesting levels, followed by parenthesis'
    },
    {
        name: 'NUMBERED_DECIMAL_NESTED',
        value: 'NUMBERED_DECIMAL_NESTED',
        description: 'A numbered list with DECIMAL numeric glyphs separated by periods, where each nesting level uses the previous nesting level\'s glyph as a prefix. For example: \'1.\', \'1.1.\', \'2.\', \'2.2.\'.'
    },
    {
        name: 'NUMBERED_UPPERALPHA_ALPHA_ROMAN',
        value: 'NUMBERED_UPPERALPHA_ALPHA_ROMAN',
        description: 'A numbered list with UPPERALPHA, ALPHA and ROMAN numeric glyphs for the first 3 list nesting levels, followed by periods'
    },
    {
        name: 'NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL',
        value: 'NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL',
        description: 'A numbered list with UPPERROMAN, UPPERALPHA and DECIMAL numeric glyphs for the first 3 list nesting levels, followed by periods'
    },
    {
        name: 'NUMBERED_ZERODECIMAL_ALPHA_ROMAN',
        value: 'NUMBERED_ZERODECIMAL_ALPHA_ROMAN',
        description: 'A numbered list with ZERODECIMAL, ALPHA and ROMAN numeric glyphs for the first 3 list nesting levels, followed by periods'
    },
];