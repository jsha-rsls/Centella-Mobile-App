import React from 'react';
import { Text, View } from 'react-native';

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
  'span': true
};

// Simple HTML parser for React Native with security
const HTMLRenderer = ({ html, style, numberOfLines }) => {
  if (!html) return null;

  // Clean and sanitize HTML
  const cleanHTML = sanitizeHTML(html);

  // Convert HTML to React Native Text elements
  const parseHTML = (htmlString) => {
    // Split by HTML tags while preserving the tags
    const parts = htmlString.split(/(<[^>]+>)/g).filter(part => part.trim() !== '');
    
    const elements = [];
    let key = 0;
    let currentStyles = {};
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith('<') && part.endsWith('>')) {
        // This is an HTML tag
        const tagMatch = part.match(/<\/?(\w+)(?:\s+[^>]*)?\s*>/);
        if (!tagMatch) continue;
        
        const isClosing = part.startsWith('</');
        const tagName = tagMatch[1].toLowerCase();
        
        // Only process allowed tags
        if (!ALLOWED_TAGS[tagName] && tagName !== 'font') continue;
        
        // Handle font size tags
        if (tagName === 'font') {
          if (!isClosing) {
            const sizeMatch = part.match(/size\s*=\s*["']?(\d+)["']?/i);
            if (sizeMatch) {
              const size = parseInt(sizeMatch[1]);
              // Convert HTML font size to React Native fontSize
              const fontSizeMap = {
                1: 12,  // Small
                2: 14,  // Normal
                3: 16,  // Medium  
                4: 18,  // Large
                5: 20,  // X-Large
                6: 24,  // XX-Large
                7: 28   // XXX-Large
              };
              currentStyles.fontSize = fontSizeMap[size] || 14;
            }
            
            // Handle color attribute
            const colorMatch = part.match(/color\s*=\s*["']?([^"'\s>]+)["']?/i);
            if (colorMatch) {
              const color = colorMatch[1];
              // Basic color validation (allow hex colors and named colors)
              if (/^#[0-9A-Fa-f]{3,6}$/.test(color) || /^[a-zA-Z]+$/.test(color)) {
                currentStyles.color = color;
              }
            }
          } else {
            delete currentStyles.fontSize;
            delete currentStyles.color;
          }
        }
        // Handle other formatting tags
        else if (tagName === 'b' || tagName === 'strong') {
          if (!isClosing) {
            currentStyles.fontWeight = 'bold';
          } else {
            delete currentStyles.fontWeight;
          }
        }
        else if (tagName === 'i' || tagName === 'em') {
          if (!isClosing) {
            currentStyles.fontStyle = 'italic';
          } else {
            delete currentStyles.fontStyle;
          }
        }
        else if (tagName === 'u') {
          if (!isClosing) {
            currentStyles.textDecorationLine = 'underline';
          } else {
            delete currentStyles.textDecorationLine;
          }
        }
        // Handle line breaks
        else if (tagName === 'br') {
          elements.push(<Text key={key++}>{'\n'}</Text>);
        }
        // Handle lists
        else if (tagName === 'ul' || tagName === 'ol') {
          if (!isClosing) {
            elements.push(<Text key={key++}>{'\n'}</Text>);
          }
        }
        else if (tagName === 'li') {
          if (!isClosing) {
            elements.push(<Text key={key++}>• </Text>);
          } else {
            elements.push(<Text key={key++}>{'\n'}</Text>);
          }
        }
        // Handle paragraphs
        else if (tagName === 'p') {
          if (!isClosing) {
            if (elements.length > 0) {
              elements.push(<Text key={key++}>{'\n'}</Text>);
            }
          } else {
            elements.push(<Text key={key++}>{'\n'}</Text>);
          }
        }
        // Handle divs
        else if (tagName === 'div') {
          if (!isClosing && elements.length > 0) {
            elements.push(<Text key={key++}>{'\n'}</Text>);
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
          
          elements.push(
            <Text key={key++} style={[style, currentStyles]}>
              {decodedText}
            </Text>
          );
        }
      }
    }
    
    return elements;
  };

  // Strip HTML tags for numberOfLines support (fallback)
  const stripHTML = (htmlString) => {
    return htmlString
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
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
      <Text style={style} numberOfLines={numberOfLines}>
        {plainText}
      </Text>
    );
  }

  // Otherwise, render with formatting
  const elements = parseHTML(cleanHTML);
  
  return (
    <Text style={style}>
      {elements}
    </Text>
  );
};

export default HTMLRenderer;