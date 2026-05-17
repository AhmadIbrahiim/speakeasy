# Template Library Feature

## Overview

The Template Library feature provides users with a collection of professionally written voicemail greeting templates that they can select and customize. This feature helps users save time and ensures they create professional-sounding voicemail greetings.

## How It Works

1. **Template Selection**: Users can browse templates categorized by use case (Professional, Business, Personal, etc.) or search for templates by keywords.

2. **Preview**: Each template shows a preview of the text, allowing users to quickly scan multiple options.

3. **Customization**: After selecting a template, users can edit the text to personalize it with their own information.

4. **Tags**: Templates are tagged with attributes like "formal," "friendly," or "business" to make them easier to find.

## Template Categories

- **Professional**: Standard greetings for business professionals
- **Business**: Templates specifically for business settings like sales or customer service
- **Personal**: More casual, friendly greetings for personal use
- **Specialized**: Industry-specific templates (medical, legal, etc.)
- **Seasonal**: Holiday and special occasion greetings

## Adding New Templates

Templates are stored in the `src/app/config/constants.ts` file in the `GREETING_TEMPLATES` array. Each template has:

- `title`: The name of the template
- `text`: The actual greeting text
- `category`: The template category
- `tags`: Array of keywords that describe the template

To add a new template, simply add a new object to the `GREETING_TEMPLATES` array following this structure:

```javascript
{
  title: "Template Name",
  text: "Template text content...",
  category: "Category",
  tags: ["tag1", "tag2"]
}
```

## Placeholders

Templates may include placeholder text in square brackets (e.g., `[business name]`) that users should replace with their specific information.

## Future Enhancements

Potential enhancements to the Template Library feature:

1. **User Templates**: Allow users to save their own custom templates
2. **Template Rating**: Let users rate templates to surface the most popular ones
3. **Industry-Specific Collections**: Expand templates for specific industries
4. **Multi-language Support**: Add templates in different languages
5. **Voice-Optimized Templates**: Templates designed for specific voice types and accents
