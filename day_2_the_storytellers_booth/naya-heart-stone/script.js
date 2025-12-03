/* Naya and the Heart-Stone - Interactive Story Engine */

// Game State Management
class GameState {
    constructor() {
        this.currentStep = 1;
        this.chosenPath = [];
        this.soundEnabled = true;
        this.playerChoices = new Map();
        this.endings = {
            triumph: false,
            tragic: false,
            wanderer: false
        };
    }
    
    save() {
        const saveData = {
            currentStep: this.currentStep,
            chosenPath: this.chosenPath,
            soundEnabled: this.soundEnabled,
            playerChoices: Array.from(this.playerChoices.entries()),
            endings: this.endings
        };
        localStorage.setItem('naya-heart-stone-save', JSON.stringify(saveData));
        this.showSaveIndicator();
    }
    
    load() {
        const saveData = localStorage.getItem('naya-heart-stone-save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.currentStep = data.currentStep || 1;
            this.chosenPath = data.chosenPath || [];
            this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            this.playerChoices = new Map(data.playerChoices || []);
            this.endings = data.endings || { triumph: false, tragic: false, wanderer: false };
            return true;
        }
        return false;
    }
    
    clear() {
        localStorage.removeItem('naya-heart-stone-save');
        this.currentStep = 1;
        this.chosenPath = [];
        this.soundEnabled = true;
        this.playerChoices.clear();
        this.endings = { triumph: false, tragic: false, wanderer: false };
    }
    
    showSaveIndicator() {
        const indicator = document.getElementById('save-indicator');
        indicator.style.opacity = '1';
        indicator.textContent = 'Game saved ✨';
        setTimeout(() => {
            indicator.style.opacity = '0.7';
            indicator.textContent = 'Game saved automatically';
        }, 2000);
    }
    
    recordChoice(step, choice) {
        this.playerChoices.set(step, choice);
        this.chosenPath.push(choice);
    }
    
    hasChoice(step, choice) {
        return this.playerChoices.get(step) === choice;
    }
    
    getPathSignature() {
        // Create a unique signature based on key choices for branching logic
        const keyChoices = {
            path: this.hasChoice(1, 'trees') ? 'trees' : 'spirits',
            element: this.playerChoices.get(3) || 'water',
            sacrifice: this.playerChoices.get(9) || 'fight'
        };
        return keyChoices;
    }
}

// Story Data Structure
const storyData = {
    1: {
        title: "The Glowing Winter Iroko Forest",
        text: `Under the tenth moon's silver glow, you are Naya, guardian of the ancient ways. The Heart-Stone of Iroko—source of life for your people—has been stolen by shadow spirits and hidden in the mystical Winter Iroko Forest.

Bioluminescent frost covers the ancient trees like dancing spirits. Two paths diverge before you, each pulsing with different energies. The winter wind carries whispers of both hope and danger.

Time is precious. Choose your path, brave Naya.`,
        choices: [
            { id: 'trees', text: '🌲 Follow the Path of Whispering Trees', icon: '🌲' },
            { id: 'spirits', text: '👻 Take the Path of Frozen Spirits', icon: '👻' }
        ]
    },
    
    2: {
        title: "Meeting Okani, the Winter Guide",
        text: `Deep in the forest, you encounter Okani, an ancient spirit guardian with eyes like frozen starlight. His form shifts between man and winter wind, adorned with glowing tribal markings.

"Young guardian," his voice echoes like distant thunder, "the path ahead tests more than courage. The Heart-Stone chose its hiding place wisely. Will you prove worthy of its trust?"

He extends his hand, and three glowing symbols appear in the air before you.`,
        choices: [
            { id: 'humble', text: '🙏 "I seek only to serve my people"', icon: '🙏' },
            { id: 'brave', text: '⚔️ "I fear no challenge, ancient one"', icon: '⚔️' },
            { id: 'wise', text: '🧠 "Teach me what I must know"', icon: '🧠' }
        ]
    },
    
    3: {
        title: "Choosing Your Elemental Affinity",
        text: `Okani nods approvingly at your response. "The Heart-Stone resonates with three primal forces in this realm. Choose the element that calls to your spirit, for it will shape your journey and determine your abilities."

Three glowing orbs float before you: one flowing like liquid moonlight, one solid as ancient earth, and one brilliant as captured starfire.

"Choose wisely, Naya. This bond cannot be broken."`,
        choices: [
            { id: 'water', text: '💧 Water - Flow like the eternal rivers', icon: '💧' },
            { id: 'earth', text: '🌍 Earth - Stand firm like the great mountains', icon: '🌍' },
            { id: 'light', text: '✨ Light - Shine bright like ancestral wisdom', icon: '✨' }
        ]
    },
    
    4: {
        title: "The First Trial",
        text: null, // Dynamic based on previous choices
        choices: null // Dynamic based on previous choices
    },
    
    5: {
        title: "Confronting the Illusions of Doubt",
        text: `As you progress deeper, the forest grows darker and more twisted. Suddenly, shadowy figures emerge from the mist—distorted reflections of yourself, whispering cruel doubts.

"You're too young," hisses one shadow. "You'll fail like all the others," sneers another. "Your people will suffer because of your weakness," taunts a third.

The illusions surround you, their words cutting deep. But you remember your training and your purpose.`,
        choices: [
            { id: 'ignore', text: '🚫 Ignore the shadows and push forward', icon: '🚫' },
            { id: 'confront', text: '⚡ Confront your fears directly', icon: '⚡' },
            { id: 'embrace', text: '❤️ Accept your fears as part of you', icon: '❤️' }
        ]
    },
    
    6: {
        title: "The Spirit Lake of Memories",
        text: `You emerge at the edge of a vast, frozen lake that glows with bioluminescent algae beneath the ice. This is the Spirit Lake of Memories, where the experiences of all who came before are preserved.

As you step onto the ice, visions flash around you—your ancestors, their struggles, their triumphs. You see the first guardians, the creation of the Heart-Stone, and the great responsibility that now rests on your shoulders.

A path of light appears across the lake, but spectral guardians rise from the ice to challenge your passage.`,
        choices: [
            { id: 'fight', text: '⚔️ Fight the spectral guardians', icon: '⚔️' },
            { id: 'honor', text: '🙏 Honor them with ancient rituals', icon: '🙏' },
            { id: 'commune', text: '👥 Attempt to commune with their spirits', icon: '👥' }
        ]
    },
    
    7: {
        title: "Battle with the Frost-Shadow Creature",
        text: `As you cross the lake, a massive creature of ice and shadow erupts from the depths. It's the guardian of this realm, a being of pure elemental fury with eyes like burning stars and claws of crystallized darkness.

The creature roars, shaking the very foundations of the spirit realm. Ice shards rain down as its shadow-tendrils reach for you. This is your greatest test yet.

Your elemental power surges within you, responding to the threat.`,
        choices: [
            { id: 'power', text: '💥 Use your full elemental power', icon: '💥' },
            { id: 'strategy', text: '🧠 Use cunning and strategy', icon: '🧠' },
            { id: 'peace', text: '🕊️ Attempt to make peace with the creature', icon: '🕊️' }
        ]
    },
    
    8: {
        title: "The Celestial Canopy",
        text: `Victory! The frost-shadow creature dissolves into sparkling mist, acknowledging your worth. The lake's surface transforms into a stairway of solid light leading upward into the star-filled sky.

You ascend into the Celestial Canopy, a realm where the Heart-Stone waits in a grove of ethereal Iroko trees. Their branches reach into infinity, heavy with glowing fruit that pulse like beating hearts.

At the center stands the Heart-Stone of Iroko—a massive crystal pulsing with the life-force of your people. But around it swirls a cage of dark energy.

The final choice approaches.`,
        choices: [
            { id: 'approach', text: '🚶 Approach the Heart-Stone carefully', icon: '🚶' },
            { id: 'meditate', text: '🧘 Meditate to understand the dark cage', icon: '🧘' },
            { id: 'call', text: '📢 Call out to the Heart-Stone directly', icon: '📢' }
        ]
    },
    
    9: {
        title: "The Final Choice",
        text: `The dark cage around the Heart-Stone pulses with malevolent energy. As you near it, a voice echoes through the celestial realm—the voice of the shadow spirits who stole the stone.

"Guardian child," the voice hisses, "the Heart-Stone can only be freed through sacrifice. You may save your people, but the choice will define not just your fate, but the fate of all future guardians.

Three paths remain. Choose wisely, for this decision echoes through eternity."`,
        choices: [
            { id: 'sacrifice', text: '⚰️ Sacrifice yourself to free the Heart-Stone', icon: '⚰️' },
            { id: 'fight', text: '⚔️ Fight the shadow spirits with all your might', icon: '⚔️' },
            { id: 'transform', text: '🦋 Transform yourself to become one with the stone', icon: '🦋' }
        ]
    },
    
    10: {
        title: "Destiny Fulfilled",
        text: null, // Dynamic based on all previous choices
        choices: null // Final step, no choices
    }
};

// Dynamic Story Content Generator
class StoryGenerator {
    static getStep4Content(gameState) {
        const pathSignature = gameState.getPathSignature();
        
        if (pathSignature.path === 'trees') {
            return {
                title: "Trial of the Ancient Grove",
                text: `The whispering trees grow louder as you proceed, their voices weaving a complex symphony of warnings and guidance. You enter a grove where massive Iroko trees form a living cathedral.

In the center, a pool of liquid starlight blocks your path. The trees whisper: "Only one who understands the balance of nature may pass."

Your ${pathSignature.element} affinity resonates with the challenge before you.`,
                choices: [
                    { id: 'nature', text: '🌿 Commune with the trees\' ancient wisdom', icon: '🌿' },
                    { id: 'force', text: '💨 Use elemental force to clear the path', icon: '💨' },
                    { id: 'patience', text: '⏰ Wait and observe the natural rhythm', icon: '⏰' }
                ]
            };
        } else {
            return {
                title: "Trial of the Frost Spirits",
                text: `The frozen spirits lead you to a chasm of swirling mists and floating ice platforms. Spectral voices echo from all directions, speaking in the ancient tongue of your ancestors.

"Young guardian," they call, "prove your connection to those who came before. Cross the chasm, but beware—one false step leads to eternal wandering in the spirit realm."

Your ${pathSignature.element} power might help you navigate this ethereal challenge.`,
                choices: [
                    { id: 'trust', text: '👥 Trust in the guidance of the spirits', icon: '👥' },
                    { id: 'intuition', text: '💫 Follow your guardian intuition', icon: '💫' },
                    { id: 'ancestry', text: '🏺 Call upon your ancestral memories', icon: '🏺' }
                ]
            };
        }
    }
    
    static getEnding(gameState) {
        const pathSignature = gameState.getPathSignature();
        const finalChoice = pathSignature.sacrifice;
        
        // Determine ending based on player journey
        if (finalChoice === 'sacrifice') {
            if (gameState.hasChoice(5, 'embrace') && gameState.hasChoice(7, 'peace')) {
                return this.getTriumphEnding(gameState);
            } else {
                return this.getTragicEnding(gameState);
            }
        } else if (finalChoice === 'transform') {
            return this.getWandererEnding(gameState);
        } else {
            // Fight choice - outcome depends on preparation
            if (gameState.hasChoice(6, 'honor') && gameState.hasChoice(7, 'strategy')) {
                return this.getTriumphEnding(gameState);
            } else {
                return this.getTragicEnding(gameState);
            }
        }
    }
    
    static getTriumphEnding(gameState) {
        gameState.endings.triumph = true;
        return {
            title: "🏆 The Guardian's Triumph",
            text: `The dark cage shatters like crystalline dreams, and the Heart-Stone of Iroko blazes with renewed life. Your sacrifice—whether of self or pride—has proven your worthiness.

The Heart-Stone rises into your hands, pulsing with the warmth of a thousand ancestors' love. As you hold it, visions flood your mind: your village restored, children laughing under the great Iroko tree, and the promise of peace for generations to come.

You return home as the sun rises on the tenth day, the Heart-Stone's light healing the land with every step. Your people greet you with songs of joy, and your name is carved into the sacred tree alongside the greatest guardians in history.

Naya, Heart-Keeper, Guardian of the Light—your legend has just begun.

🌟 **TRIUMPH ENDING ACHIEVED** 🌟

*The balance between courage and wisdom has saved your people.*`,
            choices: []
        };
    }
    
    static getTragicEnding(gameState) {
        gameState.endings.tragic = true;
        return {
            title: "😢 The Guardian's Sacrifice",
            text: `Your choice echoes through the celestial realm with devastating consequence. The Heart-Stone is freed, but at a cost too great to bear.

As the dark energy dissipates, you feel yourself becoming one with the spirit realm. Your physical form fades like morning mist, but your consciousness remains, forever bound to guard the pathways between worlds.

The Heart-Stone returns to your village, bringing life and prosperity, but your people mourn the loss of their youngest guardian. Yet in the whisper of the wind through the Iroko leaves, they hear your voice, still protecting them from beyond.

You have become legend—a cautionary tale of sacrifice, but also a beacon of hope for future guardians who will face impossible choices.

Your spirit joins the ancient guardians, forever watching over those who come after.

💔 **TRAGIC ENDING ACHIEVED** 💔

*Great sacrifice often demands the ultimate price.*`,
            choices: []
        };
    }
    
    static getWandererEnding(gameState) {
        gameState.endings.wanderer = true;
        return {
            title: "🌍 The Guardian's New Path",
            text: `As you merge with the Heart-Stone, a profound transformation begins. You become neither fully human nor spirit, but something entirely new—a bridge between worlds.

The Heart-Stone's power flows through you, but instead of returning it to your village, you realize a greater truth: the people must learn to protect themselves, to find strength within rather than depending on ancient relics.

You scatter the Heart-Stone's essence across the land, planting seeds of power in every village, every heart that yearns for protection. Your people will be stronger for learning self-reliance.

Now you walk between worlds, appearing as a guide to lost travelers, a teacher to young guardians, and a protector of the natural balance. Your story becomes myth, your name whispered by storytellers under starlit skies.

Naya, the Wandering Guardian, whose greatest gift to her people was teaching them to save themselves.

🌟 **WANDERER ENDING ACHIEVED** 🌟

*True wisdom sometimes means choosing a different path entirely.*`,
            choices: []
        };
    }
}

// Audio Manager
class AudioManager {
    constructor() {
        this.ambientSound = document.getElementById('ambient-sound');
        this.chimeSound = document.getElementById('chime-sound');
        this.soundEnabled = true;
        
        // Set default volumes
        this.ambientSound.volume = 0.3;
        this.chimeSound.volume = 0.5;
        
        // Handle audio loading errors gracefully
        this.ambientSound.addEventListener('error', () => {
            console.log('Ambient audio not available - continuing without sound');
        });
        this.chimeSound.addEventListener('error', () => {
            console.log('Chime audio not available - continuing without sound');
        });
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.playAmbient();
        } else {
            this.stopAmbient();
        }
        return this.soundEnabled;
    }
    
    playAmbient() {
        if (this.soundEnabled) {
            this.ambientSound.play().catch(() => {
                // Audio play failed - likely due to browser autoplay policy
                console.log('Ambient audio autoplay blocked');
            });
        }
    }
    
    stopAmbient() {
        this.ambientSound.pause();
    }
    
    playChime() {
        if (this.soundEnabled) {
            this.chimeSound.currentTime = 0;
            this.chimeSound.play().catch(() => {
                console.log('Chime audio play failed');
            });
        }
    }
    
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        if (enabled) {
            this.playAmbient();
        } else {
            this.stopAmbient();
        }
    }
}

// Main Game Controller
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.audioManager = new AudioManager();
        this.isTransitioning = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadGame();
    }
    
    initializeElements() {
        this.storyText = document.getElementById('story-text');
        this.choicesContainer = document.getElementById('choices-container');
        this.currentStepElement = document.getElementById('current-step');
        this.progressFill = document.getElementById('progress-fill');
        this.soundToggle = document.getElementById('sound-toggle');
        this.restartBtn = document.getElementById('restart-btn');
    }
    
    setupEventListeners() {
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.restartBtn.addEventListener('click', () => this.restart());
        
        // Try to start ambient audio on first user interaction
        document.addEventListener('click', () => {
            this.audioManager.playAmbient();
        }, { once: true });
    }
    
    loadGame() {
        const loaded = this.gameState.load();
        this.audioManager.setSoundEnabled(this.gameState.soundEnabled);
        this.updateSoundButton();
        
        if (loaded) {
            this.displayStep(this.gameState.currentStep);
        } else {
            this.startGame();
        }
    }
    
    startGame() {
        this.displayStep(1);
        this.gameState.save();
    }
    
    displayStep(stepNumber) {
        if (this.isTransitioning) return;
        
        let stepData;
        
        // Handle dynamic content generation
        if (stepNumber === 4) {
            stepData = StoryGenerator.getStep4Content(this.gameState);
        } else if (stepNumber === 10) {
            stepData = StoryGenerator.getEnding(this.gameState);
        } else {
            stepData = storyData[stepNumber];
        }
        
        if (!stepData) {
            console.error('Step data not found for step:', stepNumber);
            return;
        }
        
        // Update UI elements
        this.currentStepElement.textContent = `Step ${stepNumber}`;
        this.updateProgress(stepNumber);
        
        // Transition effect
        this.isTransitioning = true;
        this.storyText.classList.add('fade-out');
        
        setTimeout(() => {
            this.storyText.innerHTML = `<h2>${stepData.title}</h2><p>${stepData.text}</p>`;
            this.displayChoices(stepData.choices, stepNumber);
            
            this.storyText.classList.remove('fade-out');
            this.storyText.classList.add('fade-in');
            
            setTimeout(() => {
                this.storyText.classList.remove('fade-in');
                this.isTransitioning = false;
            }, 800);
        }, 500);
    }
    
    displayChoices(choices, stepNumber) {
        this.choicesContainer.innerHTML = '';
        
        if (!choices || choices.length === 0) {
            // Final step - show restart option
            const restartChoice = document.createElement('button');
            restartChoice.className = 'choice-btn';
            restartChoice.innerHTML = `<span class="choice-icon">🔄</span>Begin a New Adventure`;
            restartChoice.addEventListener('click', () => this.restart());
            this.choicesContainer.appendChild(restartChoice);
            return;
        }
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = `<span class="choice-icon">${choice.icon}</span>${choice.text}`;
            
            button.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.makeChoice(choice.id, stepNumber);
                }
            });
            
            this.choicesContainer.appendChild(button);
        });
    }
    
    makeChoice(choiceId, currentStep) {
        this.audioManager.playChime();
        this.gameState.recordChoice(currentStep, choiceId);
        this.gameState.currentStep = currentStep + 1;
        this.gameState.save();
        
        // Add slight delay for audio feedback
        setTimeout(() => {
            this.displayStep(this.gameState.currentStep);
        }, 300);
    }
    
    updateProgress(step) {
        const progress = (step / 10) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    toggleSound() {
        const enabled = this.audioManager.toggleSound();
        this.gameState.soundEnabled = enabled;
        this.gameState.save();
        this.updateSoundButton();
    }
    
    updateSoundButton() {
        this.soundToggle.textContent = this.gameState.soundEnabled ? '🔊 Sound' : '🔇 Sound';
    }
    
    restart() {
        if (confirm('Are you sure you want to restart your adventure? All progress will be lost.')) {
            this.gameState.clear();
            this.gameState.save();
            this.displayStep(1);
        }
    }
}

// Create placeholder assets if they don't exist
function createPlaceholderAssets() {
    // This will be called on page load to ensure graceful degradation
    const characterImage = document.getElementById('character-image');
    if (characterImage) {
        characterImage.style.background = 'linear-gradient(135deg, #ffd700, #00bcd4)';
        characterImage.style.display = 'flex';
        characterImage.style.alignItems = 'center';
        characterImage.style.justifyContent = 'center';
        characterImage.style.fontSize = '3rem';
        characterImage.style.fontWeight = 'bold';
        characterImage.style.color = '#1a237e';
        characterImage.textContent = '👑';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createPlaceholderAssets();
    window.game = new GameController();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameController, GameState, AudioManager };
}
