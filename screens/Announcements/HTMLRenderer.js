import React from 'react';
import { Text, View, Linking, Alert } from 'react-native';

// HTML sanitization for React Native (DOMPurify alternative)
const sanitizeHTML = (htmlString) => {
  if (!htmlString) return '';
  
  return htmlString
    // Remove potentially dangerous tags and attributes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '')
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove on* event handlers
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove style attributes that could be dangerous
    .replace(/style\s*=\s*["'][^"']*expression[^"']*["']/gi, '')
    .replace(/style\s*=\s*["'][^"']*javascript[^"']*["']/gi, '')
    // Keep only safe HTML entities
    .replace(/&(?!(amp|lt|gt|quot|#39|nbsp);)/g, '&amp;');
};

// Define allowed tags and their React Native equivalents
const ALLOWED_TAGS = {
  'b': true,
  'strong': true,
  'i': true,
  'em': true,
  'u': true,
  'font': true,
  'br': true,
  'p': true,
  'div': true,
  'ul': true,
  'ol': true,
  'li': true,
  'span': true,
  'h1': true,
  'h2': true,
  'h3': true,
  'h4': true,
  'h5': true,
  'h6': true,
  'a': true,
  'blockquote': true,
  'pre': true,
  'code': true,
  'table': true,
  'tr': true,
  'td': true,
  'th': true
};

// Extract style attributes from HTML tag
const extractStyleAttributes = (tagString) => {
  const styles = {};
  
  // Extract color
  const colorMatch = tagString.match(/color\s*[=:]\s*["']?([^"'\s>]+)["']?/i);
  if (colorMatch) {
    const color = colorMatch[1];
    if (/^#[0-9A-Fa-f]{3,6}$/.test(color) || /^rgb\(/.test(color) || /^[a-zA-Z]+$/.test(color)) {
      styles.color = color;
    }
  }
  
  // Extract background-color
  const bgColorMatch = tagString.match(/background-color\s*:\s*["']?([^"';]+)["']?/i);
  if (bgColorMatch) {
    const bgColor = bgColorMatch[1].trim();
    if (/^#[0-9A-Fa-f]{3,6}$/.test(bgColor) || /^rgb\(/.test(bgColor)) {
      styles.backgroundColor = bgColor;
    }
  }
  
  // Extract font-size
  const fontSizeMatch = tagString.match(/font-size\s*:\s*["']?(\d+(?:px|em|rem|%|pt))["']?/i);
  if (fontSizeMatch) {
    const size = fontSizeMatch[1];
    // Convert to pixels for React Native
    if (size.endsWith('px')) {
      styles.fontSize = parseInt(size);
    } else if (size.endsWith('pt')) {
      styles.fontSize = parseInt(size) * 1.33; // Approximate pt to px conversion
    } else if (size.endsWith('em') || size.endsWith('rem')) {
      styles.fontSize = parseInt(size) * 16; // Assuming base 16px
    }
  }
  
  // Extract font-weight
  const fontWeightMatch = tagString.match(/font-weight\s*:\s*["']?(bold|normal|\d{3})["']?/i);
  if (fontWeightMatch) {
    const weight = fontWeightMatch[1];
    if (weight === 'bold' || parseInt(weight) >= 600) {
      styles.fontWeight = 'bold';
    }
  }
  
  // Extract text-align
  const textAlignMatch = tagString.match(/text-align\s*:\s*["']?(left|right|center|justify)["']?/i);
  if (textAlignMatch) {
    styles.textAlign = textAlignMatch[1];
  }
  
  // Extract text-decoration
  const textDecoMatch = tagString.match(/text-decoration\s*:\s*["']?(underline|line-through|none)["']?/i);
  if (textDecoMatch) {
    const deco = textDecoMatch[1];
    if (deco === 'underline') {
      styles.textDecorationLine = 'underline';
    } else if (deco === 'line-through') {
      styles.textDecorationLine = 'line-through';
    }
  }
  
  // Extract font-style
  const fontStyleMatch = tagString.match(/font-style\s*:\s*["']?(italic|oblique|normal)["']?/i);
  if (fontStyleMatch) {
    const style = fontStyleMatch[1];
    if (style === 'italic' || style === 'oblique') {
      styles.fontStyle = 'italic';
    }
  }
  
  return styles;
};

// Extract href from anchor tag
const extractHref = (tagString) => {
  const hrefMatch = tagString.match(/href\s*=\s*["']([^"']+)["']/i);
  return hrefMatch ? hrefMatch[1] : null;
};

// Simple HTML parser for React Native with security and better formatting
const HTMLRenderer = ({ html, style, numberOfLines, onLinkPress, selectable }) => {
  if (!html) return null;

  // Clean and sanitize HTML
  const cleanHTML = sanitizeHTML(html);

  // Convert HTML to React Native Text elements
  const parseHTML = (htmlString) => {
    // Split by HTML tags while preserving the tags
    const parts = htmlString.split(/(<[^>]+>)/g).filter(part => part.trim() !== '');
    
    const elements = [];
    let key = 0;
    const styleStack = [{}]; // Stack to manage nested styles
    let listLevel = 0;
    let currentLink = null;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith('<') && part.endsWith('>')) {
        // This is an HTML tag
        const tagMatch = part.match(/<\/?(\w+)(?:\s+[^>]*)?\s*>/);
        if (!tagMatch) continue;
        
        const isClosing = part.startsWith('</');
        const tagName = tagMatch[1].toLowerCase();
        
        // Only process allowed tags
        if (!ALLOWED_TAGS[tagName]) continue;
        
        if (!isClosing) {
          // Opening tag - push new style to stack
          const newStyles = { ...styleStack[styleStack.length - 1] };
          
          // Extract inline styles
          const inlineStyles = extractStyleAttributes(part);
          Object.assign(newStyles, inlineStyles);
          
          // Handle specific tags
          switch (tagName) {
            case 'font':
              const sizeMatch = part.match(/size\s*=\s*["']?(\d+)["']?/i);
              if (sizeMatch) {
                const size = parseInt(sizeMatch[1]);
                const fontSizeMap = { 1: 10, 2: 13, 3: 16, 4: 18, 5: 24, 6: 32, 7: 48 };
                newStyles.fontSize = fontSizeMap[size] || 16;
              }
              const colorMatch = part.match(/color\s*=\s*["']?([^"'\s>]+)["']?/i);
              if (colorMatch && /^#[0-9A-Fa-f]{3,6}$/.test(colorMatch[1])) {
                newStyles.color = colorMatch[1];
              }
              break;
              
            case 'b':
            case 'strong':
              newStyles.fontWeight = 'bold';
              break;
              
            case 'i':
            case 'em':
              newStyles.fontStyle = 'italic';
              break;
              
            case 'u':
              newStyles.textDecorationLine = 'underline';
              break;
              
            case 'h1':
              newStyles.fontSize = 32;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 8;
              break;
              
            case 'h2':
              newStyles.fontSize = 28;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 7;
              break;
              
            case 'h3':
              newStyles.fontSize = 24;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 6;
              break;
              
            case 'h4':
              newStyles.fontSize = 20;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 5;
              break;
              
            case 'h5':
              newStyles.fontSize = 18;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 4;
              break;
              
            case 'h6':
              newStyles.fontSize = 16;
              newStyles.fontWeight = 'bold';
              newStyles.marginVertical = 3;
              break;
              
            case 'blockquote':
              newStyles.paddingLeft = 10;
              newStyles.borderLeftWidth = 3;
              newStyles.borderLeftColor = '#ccc';
              newStyles.fontStyle = 'italic';
              break;
              
            case 'code':
            case 'pre':
              newStyles.fontFamily = 'monospace';
              newStyles.backgroundColor = '#f5f5f5';
              newStyles.padding = 4;
              break;
              
            case 'a':
              const href = extractHref(part);
              if (href) {
                currentLink = href;
                newStyles.color = '#0066cc';
                newStyles.textDecorationLine = 'underline';
              }
              break;
              
            case 'br':
              elements.push(<Text key={key++}>{'\n'}</Text>);
              continue;
              
            case 'ul':
            case 'ol':
              listLevel++;
              if (elements.length > 0) {
                elements.push(<Text key={key++}>{'\n'}</Text>);
              }
              styleStack.push(newStyles);
              continue;
              
            case 'li':
              const indent = '  '.repeat(listLevel - 1);
              elements.push(<Text key={key++}>{indent}• </Text>);
              break;
              
            case 'p':
              if (elements.length > 0) {
                elements.push(<Text key={key++}>{'\n\n'}</Text>);
              }
              break;
              
            case 'div':
              if (elements.length > 0) {
                elements.push(<Text key={key++}>{'\n'}</Text>);
              }
              break;
          }
          
          styleStack.push(newStyles);
          
        } else {
          // Closing tag - pop style from stack
          if (styleStack.length > 1) {
            styleStack.pop();
          }
          
          switch (tagName) {
            case 'ul':
            case 'ol':
              listLevel--;
              elements.push(<Text key={key++}>{'\n'}</Text>);
              break;
              
            case 'li':
              elements.push(<Text key={key++}>{'\n'}</Text>);
              break;
              
            case 'p':
              elements.push(<Text key={key++}>{'\n'}</Text>);
              break;
              
            case 'a':
              currentLink = null;
              break;
              
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              elements.push(<Text key={key++}>{'\n'}</Text>);
              break;
          }
        }
      } else {
        // This is text content
        if (part.trim()) {
          // Decode HTML entities
          const decodedText = part
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');
          
          const currentStyles = styleStack[styleStack.length - 1];
          
          if (currentLink && onLinkPress) {
            elements.push(
              <Text
                key={key++}
                style={[style, currentStyles]}
                onPress={() => onLinkPress(currentLink, decodedText)}
              >
                {decodedText}
              </Text>
            );
          } else {
            elements.push(
              <Text key={key++} style={[style, currentStyles]}>
                {decodedText}
              </Text>
            );
          }
        }
      }
    }
    
    return elements;
  };

  // Strip HTML tags for numberOfLines support (fallback)
  const stripHTML = (htmlString) => {
    return htmlString
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<li>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  // If numberOfLines is specified, use stripped text for better truncation
  if (numberOfLines) {
    const plainText = stripHTML(cleanHTML);
    return (
      <Text style={style} numberOfLines={numberOfLines} selectable={selectable}>
        {plainText}
      </Text>
    );
  }

  // Otherwise, render with formatting
  const elements = parseHTML(cleanHTML);
  
  return (
    <Text style={style} selectable={selectable}>
      {elements}
    </Text>
  );
};

export default HTMLRenderer;