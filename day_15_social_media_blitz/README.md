# Social Media Campaign System

## 🎯 Overview

This system helps social media coordinators like Zara create comprehensive social media campaigns for events. Input event details once and get perfectly formatted content for Instagram, Twitter/X, and Facebook instantly.

## 📁 Recipe Structure

```
recipes/
├── social-campaign.yaml      # Main orchestrator recipe
├── instagram-post.yaml       # Instagram content generation
├── twitter-thread.yaml       # Twitter/X thread creation
└── facebook-event.yaml       # Facebook event description
```

## 🚀 How to Use

### Main Command
```bash
goose run social-campaign --event_name "Summer Music Fest 2024" \
  --event_date "July 15-16, 2024" \
  --event_description "Two days of incredible live music featuring indie, rock, and electronic artists on multiple stages" \
  --target_audience "Music lovers aged 18-35 who enjoy live concerts and discovering new artists" \
  --call_to_action "Get your early bird tickets now and save 30%"
```

### Individual Platform Testing
```bash
# Test Instagram only
goose run instagram-post --event_name "Summer Music Fest 2024" [other params...]

# Test Twitter only  
goose run twitter-thread --event_name "Summer Music Fest 2024" [other params...]

# Test Facebook only
goose run facebook-event --event_name "Summer Music Fest 2024" [other params...]
```

## 📋 Required Parameters

All recipes accept these core parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `event_name` | Name of the festival event | "Summer Music Fest 2024" |
| `event_date` | When it's happening | "July 15-16, 2024" |
| `event_description` | What the event is about | "Two days of incredible live music..." |
| `target_audience` | Who should attend | "Music lovers aged 18-35..." |
| `call_to_action` | What you want people to do | "Get your early bird tickets..." |

## 🎨 Platform-Specific Outputs

### Instagram (`instagram-post.yaml`)
- Captivating caption (125-150 words)
- Strategic hashtags (15-20 relevant tags)
- Emojis for visual appeal
- Clear call to action

### Twitter/X (`twitter-thread.yaml`)
- Engaging 3-5 tweet thread
- Excitement-building progression
- Character limit compliance (<280 per tweet)
- Strategic hashtag placement

### Facebook (`facebook-event.yaml`)
- Comprehensive event description (300-400 words)
- Detailed logistics and practical info
- Professional formatting with sections
- Clear registration/ticket information

## 💡 Example Campaign Output

### Instagram Post Example:
```
🎵 Ready for the ultimate music experience? 

Summer Music Fest 2024 is bringing two incredible days of indie, rock, and electronic artists to multiple stages! Whether you're a longtime music lover or discovering new sounds, this is YOUR festival! 

✨ What awaits you:
🎤 Amazing live performances
🎶 Multiple music genres
👥 Community of music enthusiasts
🎪 Unforgettable atmosphere

Don't miss out on early bird savings! 

#SummerMusicFest2024 #LiveMusic #MusicFestival #IndieMusic #RockMusic #ElectronicMusic #MusicLovers #FestivalSeason #EarlyBird #SaveTheDate
```

### Twitter Thread Example:
```
1/4 🎵 Something HUGE is coming this summer... Summer Music Fest 2024! Two days of mind-blowing music across multiple stages. Music lovers, this one's for you! 🧵👇

2/4 🎸 Indie, rock, AND electronic artists all in one incredible weekend (July 15-16). Whether you're 18 or 35, prepare for the musical experience of a lifetime! 

3/4 ✨ Multiple stages means non-stop music, diverse sounds, and the chance to discover your next favorite artist. This isn't just a festival - it's a music lover's paradise!

4/4 🎫 Early bird tickets are NOW LIVE with 30% savings! Don't sleep on this - grab yours before prices go up! #SummerMusicFest2024 #EarlyBird #MusicFestival
```

### Facebook Event Example:
```
🎵 SUMMER MUSIC FEST 2024 - Two Days of Musical Magic Awaits! 

Get ready for the most anticipated music event of the summer! Summer Music Fest 2024 brings together incredible indie, rock, and electronic artists across multiple stages for an unforgettable weekend experience.

🎯 WHAT TO EXPECT
• Live performances from top indie, rock, and electronic artists
• Multiple stages with continuous entertainment
• Food trucks and local vendors
• Community atmosphere perfect for music discovery
• Professional sound and lighting production

📋 EVENT DETAILS
📅 When: July 15-16, 2024
📍 Where: Location details to be announced soon
👥 Who: Perfect for music lovers aged 18-35 and anyone passionate about live music

🎫 HOW TO JOIN
Early bird tickets are now available with 30% off regular pricing! Limited time offer - don't wait to secure your spot.

💡 PRACTICAL INFO
• Tickets include both festival days
• Food and beverages available for purchase
• Rain or shine event
• More details on parking and logistics coming soon

Ready to experience two days of incredible music? Get your early bird tickets now and save 30% - this deal won't last long!

#SummerMusicFest2024 #MusicFestival #LiveMusic #IndieMusic #RockMusic #ElectronicMusic #EarlyBirdSpecial #FestivalSeason
```

## 🔧 System Benefits

- **Efficiency**: Create content for all platforms in one go
- **Consistency**: Ensures brand voice across platforms
- **Platform Optimization**: Each piece tailored for platform best practices
- **Reusability**: Use for every future event
- **Time Saving**: No more manual content creation for each platform

## 📈 Success Metrics

✅ **Complete Campaign Creation**: All 4 recipes working together  
✅ **Platform-Specific Content**: Instagram, Twitter, Facebook optimized  
✅ **Parameter Flexibility**: Works with any event details  
✅ **Professional Quality**: Ready-to-publish content  
✅ **Reusable System**: Template for all future campaigns  

## 🎪 Perfect for Festival Events

This system is especially designed for festival organizers and event coordinators who need to:
- Promote events across multiple social platforms
- Maintain consistent messaging
- Save time on content creation
- Ensure professional, engaging content
- Scale their marketing efforts

Ready to revolutionize your social media campaigns? 🚀