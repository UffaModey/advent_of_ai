#!/usr/bin/env python3
"""
❄️ MADAME ZELDA'S ENCHANTED GOOSE-POWERED ORACLE ❄️
A magical fortune teller generator for winter fortunes!
"""

import random
import sys
from typing import Dict, List

def print_ascii_banner():
    """Display the magical ASCII banner"""
    banner = """
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝

██╗   ██╗ ██████╗ ██╗   ██╗██████╗     ███████╗ ██████╗ ██████╗ ████████╗██╗   ██╗███╗   ██╗███████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██║   ██║████╗  ██║██╔════╝
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝    █████╗  ██║   ██║██████╔╝   ██║   ██║   ██║██╔██╗ ██║█████╗  
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██╔══╝  ██║   ██║██╔══██╗   ██║   ██║   ██║██║╚██╗██║██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝██║  ██║    ██║     ╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║ ╚████║███████╗
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝

 █████╗ ██╗    ██╗ █████╗ ██╗████████╗███████╗██╗
██╔══██╗██║    ██║██╔══██╗██║╚══██╔══╝██╔════╝██║
███████║██║ █╗ ██║███████║██║   ██║   ███████╗██║
██╔══██║██║███╗██║██╔══██║██║   ██║   ╚════██║╚═╝
██║  ██║╚███╔███╔╝██║  ██║██║   ██║   ███████║██╗
╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝
    """
    
    print("❄️" * 60)
    print(banner)
    print("           ✨ WELCOME, YOUR FORTUNE AWAITS! ✨")
    print("❄️" * 60)

class FortuneGenerator:
    """Madame Zelda's mystical fortune generator"""
    
    def __init__(self):
        self.fortunes = {
            'grumpy': {
                'prophecies': [
                    "The winter winds whisper of your terrible mood,\nlike mine when forced to divine for ungrateful souls.\nYet beneath this frost, warmth may grudgingly emerge,\nthough it'll probably disappoint you anyway.",
                    "Snow falls to mock your plans, as usual.\nThe universe conspires against your comfort,\nbut perhaps a hot beverage will salvage\nthis cosmic catastrophe of a season.",
                    "Your future sparkles like ice on concrete—\nslippery, cold, and guaranteed to cause problems.\nBut even winter's worst tantrums eventually end,\nmuch like my patience with cheerful people.",
                    "The crystal ball shows... ugh, more cold weather.\nYour destiny involves soggy boots and bitter coffee,\nbut maybe, just maybe, you'll find something\nto complain about that brings you joy."
                ],
                'lucky_charms': [
                    "a grumpy snow cat", "burnt marshmallows", "cold coffee", "tangled Christmas lights",
                    "a scowling snowman", "frozen door locks", "dead phone batteries", "soggy mittens"
                ],
                'unlucky_omens': [
                    "forced holiday cheer", "jingly music before November", "melted snow in your boots",
                    "people who say 'winter wonderland'", "frozen car doors", "cheerful morning people"
                ]
            },
            'poetic': {
                'prophecies': [
                    "Like silver threads through midnight's veil,\nyour path winds through crystalline dreams.\nWinter's breath carries whispered promises\nof renewal hidden beneath the silence.",
                    "Snowflakes dance as messengers of fate,\neach unique, each carrying a secret.\nIn their gentle descent lies your answer—\nbeauty emerges from life's coldest moments.",
                    "The moon's pale light on virgin snow\nreflects the purity of coming change.\nAs rivers sleep beneath their icy veils,\nso too your greatest strength lies dormant.",
                    "Stars pierce the winter's velvet darkness,\nconstellations spelling out your story.\nIn the hushed cathedral of frosted trees,\nyour soul will find its clearest song."
                ],
                'lucky_charms': [
                    "frost-kissed rose petals", "moonbeams on snow", "a cardinal's song",
                    "icicles like crystal daggers", "the first star", "winter's breath"
                ],
                'unlucky_omens': [
                    "broken snowflakes", "silent winter nights", "footprints that vanish",
                    "shadows on white snow", "the last leaf falling"
                ]
            },
            'festive': {
                'prophecies': [
                    "Ho ho ho! The season sparkles with magic\nas bright as tinsel and warm as cocoa!\nBells will ring good fortune into your life,\nwrapped in ribbons of joy and wonder!",
                    "Jingle bells, jingle bells, fortune rings!\nHoliday magic swirls around your future\nlike sugar in hot chocolate—sweet surprises\nand candy cane wishes coming true!",
                    "The Christmas star shines especially bright\nfor souls who believe in winter miracles!\nGingerbread dreams and peppermint hopes\nwill dance their way into your destiny!",
                    "Fa-la-la-la-luck is heading your way!\nWrapped in holly and tied with golden dreams,\nyour future glimmers like fresh snow\nunder twinkling holiday lights!"
                ],
                'lucky_charms': [
                    "jingling sleigh bells", "candy cane stripes", "twinkling lights",
                    "warm mittens", "hot chocolate marshmallows", "golden ornaments"
                ],
                'unlucky_omens': [
                    "burnt cookies", "tangled garland", "empty stockings",
                    "broken ornaments", "cold fireplaces", "forgotten wishes"
                ]
            },
            'sarcastic': {
                'prophecies': [
                    "Oh wonderful, another winter forecast!\nThe stars align to bring you... snow. Shocking.\nYour future holds the stunning revelation\nthat cold weather makes things cold. Groundbreaking.",
                    "Behold! The crystal reveals your destiny:\nyou will experience... winter. In winter.\nTruly, my mystical powers are unparalleled\nin stating the blindingly obvious.",
                    "Amazing! The cosmic forces conspire\nto bring you exactly what you'd expect:\nmore of the same seasonal nonsense\neveryone else is also experiencing. Revolutionary.",
                    "The universe whispers its profound wisdom:\n'It's going to be cold, probably wet,\nand you'll complain about it.' Truly,\nI am a vessel of earth-shattering insight."
                ],
                'lucky_charms': [
                    "obvious predictions", "captain obvious's hat", "a working crystal ball",
                    "low expectations", "realistic forecasts", "common sense"
                ],
                'unlucky_omens': [
                    "believing in horoscopes", "expecting surprises", "hoping for warmth",
                    "trusting weather apps", "optimistic thinking", "asking for more fortunes"
                ]
            },
            'mysterious': {
                'prophecies': [
                    "The mists part to reveal... shadows within shadows.\nWhat was once hidden shall emerge\nwhen three snowflakes fall as one,\nand the winter moon wears her silver crown.",
                    "Ancient whispers echo through frosted glass—\nsecrets buried beneath layers of white silence.\nThe key you seek lies where warmth meets cold,\nand yesterday's footprints lead to tomorrow.",
                    "In the space between snowfall and silence,\ntruth dwells in riddles of ice and time.\nWhat the wind carries away, the frost preserves,\nand what seems lost merely waits to be found.",
                    "The veil grows thin when winter winds blow\nthrough the chambers of forgotten dreams.\nSeek the answer where shadows gather\nin the hollow places between heartbeats."
                ],
                'lucky_charms': [
                    "whispered secrets", "forgotten keys", "midnight shadows",
                    "ancient runes in frost", "silver mirrors", "echoing footsteps"
                ],
                'unlucky_omens': [
                    "doors that open themselves", "mirrors that lie", "sounds with no source",
                    "paths that change direction", "names spoken in empty rooms"
                ]
            }
        }
    
    def generate_fortune(self, mood: str) -> str:
        """Generate a fortune for the specified mood"""
        if mood not in self.fortunes:
            return self._unknown_mood_fortune()
        
        mood_data = self.fortunes[mood]
        prophecy = random.choice(mood_data['prophecies'])
        lucky_charm = random.choice(mood_data['lucky_charms'])
        unlucky_omen = random.choice(mood_data['unlucky_omens'])
        
        # Create the fortune box
        mood_emoji = {
            'grumpy': '😤',
            'poetic': '🌙',
            'festive': '🎄',
            'sarcastic': '🙄',
            'mysterious': '🔮'
        }
        
        fortune_box = f"""
╔═══════════════════════════════════════════════════════════╗
║ 🔮 THE CRYSTAL SPEAKS {mood_emoji.get(mood, '✨')} ({mood.upper()}) 🔮 
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ {self._wrap_text(prophecy, 57)}
║                                                           ║
║ ❄️ Lucky charm: {lucky_charm:<38} ❄️ ║
║ ⚠️  Unlucky omen: {unlucky_omen:<36} ⚠️  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        """
        
        return fortune_box
    
    def _wrap_text(self, text: str, width: int) -> str:
        """Wrap text to fit within the fortune box"""
        lines = text.split('\n')
        wrapped_lines = []
        
        for line in lines:
            while len(line) > width:
                # Find the last space within the width
                break_point = line.rfind(' ', 0, width)
                if break_point == -1:
                    break_point = width
                
                wrapped_lines.append(f"║ {line[:break_point]:<{width}} ║")
                line = line[break_point:].lstrip()
            
            if line.strip():  # Only add non-empty lines
                wrapped_lines.append(f"║ {line:<{width}} ║")
        
        return '\n'.join(wrapped_lines)
    
    def _unknown_mood_fortune(self) -> str:
        """Fortune for unknown moods"""
        return """
╔═══════════════════════════════════════════════════════════╗
║ 🔮 THE CRYSTAL IS CONFUSED 🤔                            ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║ The mystical energies are unclear...                     ║
║ Try one of these moods instead:                          ║
║ • grumpy • poetic • festive • sarcastic • mysterious     ║
║                                                           ║
║ ❄️ Lucky charm: clearer instructions                     ║
║ ⚠️  Unlucky omen: confusing the oracle                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
        """

def main():
    """Main fortune teller function"""
    print_ascii_banner()
    
    # Get mood from command line argument or prompt user
    if len(sys.argv) > 1:
        mood = sys.argv[1].lower()
    else:
        print("\n🧙‍♀️ Choose your fortune's mood:")
        print("   grumpy | poetic | festive | sarcastic | mysterious")
        print()
        mood = input("Enter mood: ").lower().strip()
    
    # Generate and display the fortune
    generator = FortuneGenerator()
    fortune = generator.generate_fortune(mood)
    
    print(fortune)
    
    # Add some magical footer
    print("✨" * 20 + " May magic guide your path " + "✨" * 20)
    print("🦆 Powered by Madame Zelda's Enchanted Goose Oracle 🦆")
    print()

if __name__ == "__main__":
    main()
