# Test Campaign Examples

## Sample Event Data for Testing

Here are complete test scenarios you can use to validate the social media campaign system:

### Test Event 1: Music Festival
```yaml
event_name: "Summer Music Fest 2024"
event_date: "July 15-16, 2024"
event_description: "Two days of incredible live music featuring indie, rock, and electronic artists on multiple stages"
target_audience: "Music lovers aged 18-35 who enjoy live concerts and discovering new artists"
call_to_action: "Get your early bird tickets now and save 30%"
```

### Test Event 2: Food Festival
```yaml
event_name: "Taste of the City Food Festival"
event_date: "September 8-10, 2024"
event_description: "A culinary celebration featuring local restaurants, food trucks, cooking demonstrations, and wine tastings"
target_audience: "Food enthusiasts, families, and anyone who loves trying new cuisines"
call_to_action: "Reserve your weekend pass and enjoy exclusive chef meet-and-greets"
```

### Test Event 3: Arts & Culture Festival
```yaml
event_name: "Downtown Arts & Culture Fest"
event_date: "October 12-13, 2024"
event_description: "Interactive art installations, live performances, local artist showcases, and hands-on creative workshops"
target_audience: "Artists, art lovers, families with children, and community members interested in local culture"
call_to_action: "Register for free admission and workshop spots - limited availability"
```

## Manual Testing Commands

### Full Campaign Test
```bash
goose run social-campaign \
  --event_name "Summer Music Fest 2024" \
  --event_date "July 15-16, 2024" \
  --event_description "Two days of incredible live music featuring indie, rock, and electronic artists on multiple stages" \
  --target_audience "Music lovers aged 18-35 who enjoy live concerts and discovering new artists" \
  --call_to_action "Get your early bird tickets now and save 30%"
```

### Individual Platform Tests
```bash
# Instagram Test
goose run instagram-post \
  --event_name "Taste of the City Food Festival" \
  --event_date "September 8-10, 2024" \
  --event_description "A culinary celebration featuring local restaurants, food trucks, cooking demonstrations, and wine tastings" \
  --target_audience "Food enthusiasts, families, and anyone who loves trying new cuisines" \
  --call_to_action "Reserve your weekend pass and enjoy exclusive chef meet-and-greets"

# Twitter Test
goose run twitter-thread \
  --event_name "Downtown Arts & Culture Fest" \
  --event_date "October 12-13, 2024" \
  --event_description "Interactive art installations, live performances, local artist showcases, and hands-on creative workshops" \
  --target_audience "Artists, art lovers, families with children, and community members interested in local culture" \
  --call_to_action "Register for free admission and workshop spots - limited availability"

# Facebook Test
goose run facebook-event \
  --event_name "Summer Music Fest 2024" \
  --event_date "July 15-16, 2024" \
  --event_description "Two days of incredible live music featuring indie, rock, and electronic artists on multiple stages" \
  --target_audience "Music lovers aged 18-35 who enjoy live concerts and discovering new artists" \
  --call_to_action "Get your early bird tickets now and save 30%"
```

## Expected Output Validation

### Instagram Post Should Include:
- [ ] Opening hook with emoji
- [ ] Event details naturally woven in
- [ ] 125-150 words main caption
- [ ] 15-20 relevant hashtags
- [ ] Strategic emoji placement
- [ ] Clear call to action

### Twitter Thread Should Include:
- [ ] 3-5 tweets total
- [ ] First tweet with hook and "🧵👇"
- [ ] Each tweet under 280 characters
- [ ] Building excitement through progression
- [ ] Call to action in final tweet
- [ ] Relevant hashtags (2-3 per tweet max)

### Facebook Event Should Include:
- [ ] Compelling opening paragraph
- [ ] "What to Expect" section with bullet points
- [ ] "Event Details" with date/time/location
- [ ] "How to Join" registration info
- [ ] "Practical Info" logistics
- [ ] Strong closing call to action
- [ ] 300-400 words total
- [ ] 5-8 hashtags at end

## Quality Checklist

### Content Quality:
- [ ] Engaging and excitement-building language
- [ ] Platform-appropriate tone and style
- [ ] Clear value proposition for attendees
- [ ] Compelling call to action
- [ ] Professional but approachable voice

### Technical Requirements:
- [ ] Proper character limits respected
- [ ] Hashtag best practices followed
- [ ] Emoji usage enhances readability
- [ ] Format consistent with platform norms
- [ ] All required parameters properly utilized

### Campaign Cohesion:
- [ ] Consistent event information across platforms
- [ ] Complementary but unique content for each platform
- [ ] Unified brand voice and messaging
- [ ] Cross-platform content strategy evident
- [ ] Target audience properly addressed on each platform

## Troubleshooting Common Issues

### Recipe Doesn't Run:
1. Check YAML syntax and indentation
2. Verify all required parameters are provided
3. Ensure recipe file paths are correct
4. Check parameter names match exactly

### Content Quality Issues:
1. Verify event description provides enough detail
2. Check target audience is specific enough
3. Ensure call to action is clear and actionable
4. Review if event date format is consistent

### Platform-Specific Problems:
1. **Instagram**: Check if hashtags are relevant and not overly generic
2. **Twitter**: Verify each tweet is under character limit
3. **Facebook**: Ensure comprehensive logistics information included

## Success Criteria Validation

✅ **System Complete**: All 4 recipes created and functional  
✅ **Content Generated**: Each platform produces appropriate content  
✅ **Parameters Work**: All 5 core parameters properly utilized  
✅ **Quality Output**: Professional, engaging, platform-optimized content  
✅ **Reusable**: System works with different event types and details  
✅ **Documentation**: Clear instructions and examples provided  

Ready to test your social media campaign system! 🚀