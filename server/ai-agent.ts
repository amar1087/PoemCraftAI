import OpenAI from "openai";
import type { GeneratePoemRequest } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface PoemGenerationResult {
  content: string;
  success: boolean;
  error?: string;
}

export class AIAgent {
  async generatePoem(request: GeneratePoemRequest): Promise<PoemGenerationResult> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a talented poet who creates beautiful, personalized poems for special occasions. Your poems should be heartfelt, well-structured, and appropriate for the given event and style. Always create original content that captures the emotion and significance of the occasion."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        return {
          content: "",
          success: false,
          error: "No poem content generated"
        };
      }

      return {
        content: content.trim(),
        success: true
      };
    } catch (error) {
      console.error("AI poem generation failed:", error);
      
      // Fallback to template-based generation if AI fails
      const fallbackContent = this.generateFallbackPoem(request);
      
      return {
        content: fallbackContent,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  private buildPrompt(request: GeneratePoemRequest): string {
    const { eventType, names, style, childrenTheme, childrenOptions, learningTopic } = request;
    
    let prompt = `Create a ${style} poem`;
    
    if (eventType === "children") {
      if (childrenTheme && childrenOptions && childrenOptions.length > 0) {
        if (childrenOptions.length === 1) {
          prompt += ` for children about ${childrenOptions[0]}`;
        } else {
          prompt += ` for children featuring ${childrenOptions.join(", ")}`;
        }
      } else {
        prompt += ` for children`;
      }
    } else if (eventType === "learning") {
      if (learningTopic) {
        const topicLabel = this.getLearningTopicLabel(learningTopic);
        prompt += ` to help children learn about ${topicLabel}`;
      } else {
        prompt += ` to help children learn`;
      }
    } else {
      prompt += ` for a ${eventType}`;
    }
    
    if (names && names.trim()) {
      const namesList = names.split(",").map(n => n.trim()).filter(n => n);
      if (namesList.length === 1) {
        prompt += ` for ${namesList[0]}`;
      } else if (namesList.length > 1) {
        prompt += ` for ${namesList.join(" and ")}`;
      }
    }
    
    prompt += `.

Style guidelines:
- Heartfelt: Emotional, sincere, touching, meaningful
- Playful: Fun, lighthearted, cheerful, energetic
- Elegant: Sophisticated, graceful, refined, classic
- Humorous: Funny, witty, amusing, light-hearted`;

    if (eventType === "children") {
      prompt += `

Children's poem requirements:
- Use simple, age-appropriate language
- Include fun sounds, rhythms, and rhymes
- Make it engaging and easy to remember
- Use vivid, colorful imagery
- Keep it positive and uplifting
- Create 2-3 short stanzas`;
      
      if (childrenOptions && childrenOptions.length > 0) {
        if (childrenOptions.length === 1) {
          prompt += `\n- Focus on ${childrenOptions[0]} and make it the main character or subject
- Include characteristics and behaviors of ${childrenOptions[0]}
- Make it educational while being fun`;
        } else {
          prompt += `\n- Feature ${childrenOptions.join(", ")} in the poem
- Show how they interact or play together
- Make it a fun adventure with all the selected items`;
        }
      }
    } else if (eventType === "learning") {
      prompt += `

Learning poem requirements:
- Use simple, educational language
- Teach concepts through rhythm and rhyme
- Make learning fun and memorable
- Include factual information
- Use repetition to reinforce learning
- Create 3-4 educational stanzas`;
      
      if (learningTopic) {
        const topicLabel = this.getLearningTopicLabel(learningTopic);
        prompt += `\n- Focus on teaching ${topicLabel}
- Include specific facts and examples
- Make it interactive and engaging
- Help children remember key concepts`;
      }
    } else {
      prompt += `

Requirements:
- Create an original poem of 3-4 stanzas
- Make it appropriate for the ${eventType} occasion
- Include specific references to the event type`;
    }

    prompt += `
- Use a ${style} tone throughout
- Make it personal and meaningful`;

    if (names && names.trim()) {
      prompt += `\n- Incorporate the name(s) naturally into the poem`;
    }

    prompt += `\n- Ensure proper rhythm and rhyme scheme
- Make it memorable and touching

Please write only the poem content, no additional text or explanations.`;

    return prompt;
  }

  private getLearningTopicLabel(topic: string): string {
    const topics = {
      "numbers": "Numbers & Counting",
      "alphabet": "Alphabet & Letters", 
      "colors": "Colors & Shapes",
      "seasons": "Seasons & Weather",
      "body-parts": "Body Parts",
      "family": "Family & Friends",
      "emotions": "Emotions & Feelings",
      "safety": "Safety Rules",
      "healthy-habits": "Healthy Habits",
      "good-manners": "Good Manners"
    };
    return topics[topic as keyof typeof topics] || topic;
  }

  private generateFallbackPoem(request: GeneratePoemRequest): string {
    const { eventType, names, style, childrenTheme, childrenOptions, learningTopic } = request;
    const namesList = names?.split(",").map(n => n.trim()).filter(n => n) || [];
    const primaryName = namesList[0] || (eventType === "children" || eventType === "learning" ? "little one" : "dear friend");
    
    if (eventType === "children") {
      return this.generateChildrenFallback(primaryName, style, childrenTheme, childrenOptions);
    }
    
    if (eventType === "learning") {
      return this.generateLearningFallback(primaryName, style, learningTopic);
    }
    
    const fallbackTemplates = {
      birthday: {
        heartfelt: [
          `Another year has come to pass,`,
          `With memories that will always last,`,
          `Dear ${primaryName}, on this special day,`,
          `We celebrate you in every way.`,
          ``,
          `Your laughter brightens every room,`,
          `Your kindness helps dispel all gloom,`,
          `May this birthday bring you joy so true,`,
          `And all your dreams come shining through.`
        ],
        playful: [
          `🎉 It's party time, hooray hooray!`,
          `${primaryName}'s birthday is here today!`,
          `Cake and presents, fun galore,`,
          `Let's celebrate and then some more!`,
          ``,
          `Another year of awesome you,`,
          `Happy Birthday! Dreams come true! 🎂`
        ],
        elegant: [
          `In graceful years that gently flow,`,
          `Your wisdom and your beauty grow,`,
          `${primaryName}, on this day of birth,`,
          `We celebrate your gentle worth.`
        ],
        humorous: [
          `Another year older, but who's counting?`,
          `(Okay, maybe the candles are mounting!)`,
          `${primaryName}, you're aging like fine wine,`,
          `Which means you're getting better with time!`
        ]
      }
    };

    const eventTemplates = fallbackTemplates[eventType as keyof typeof fallbackTemplates];
    if (eventTemplates) {
      const styleTemplate = eventTemplates[style as keyof typeof eventTemplates];
      if (styleTemplate) {
        return styleTemplate.join('\n');
      }
    }

    return `A special ${eventType} poem for ${primaryName}!\n\nMay this occasion bring you joy,\nAnd happiness that none can destroy,\nWith love and laughter all around,\nMay blessings in your life be found!`;
  }

  private generateChildrenFallback(name: string, style: string, childrenTheme?: string, childrenOptions?: string[]): string {
    if (childrenOptions && childrenOptions.length > 1) {
      // Multi-item poem
      const items = childrenOptions.join(", ");
      return `${name}, let's explore a world so bright,\nWith ${items} - what a sight!\n\nThey dance and play throughout the day,\nIn such a fun and magical way,\nEach one unique and special too,\nJust like the wonderful you!\n\nTogether they create such joy,\nEvery girl and every boy,\nCan learn and laugh and sing along,\nWith this happy, cheerful song!`;
    }

    const [theme, specific] = childrenTheme?.split("-") || ["animals", "puppy"];
    const item = childrenOptions?.[0] || specific;
    
    const childrenTemplates = {
      "animals-puppy": {
        playful: [
          `${name}, here's a puppy story just for you,`,
          `A little friend who's fluffy and so true!`,
          `Wag, wag, wag goes his happy tail,`,
          `Bounding through the yard without fail!`,
          ``,
          `Soft and cuddly, brown and white,`,
          `He loves to play from dawn till night,`,
          `Your puppy friend will always be`,
          `Full of love and joy for thee!`
        ],
        heartfelt: [
          `Dear ${name}, a puppy's love is pure and bright,`,
          `Like sunshine warming everything in sight,`,
          `With gentle eyes and paws so small,`,
          `He'll be your friend through one and all.`,
          ``,
          `In every bark and playful bound,`,
          `The sweetest friendship can be found,`,
          `A loyal heart that beats so true,`,
          `A puppy's love, just made for you.`
        ]
      },
      "toys-teddy": {
        playful: [
          `${name}, your teddy bear is here to say,`,
          `"Let's have some fun and play today!"`,
          `Soft and brown with button eyes,`,
          `He'll keep you safe beneath the skies.`,
          ``,
          `Hugs and cuddles all day long,`,
          `He'll listen to your favorite song,`,
          `Your teddy friend will always be`,
          `Right there with you, happily!`
        ]
      }
    };

    const templateKey = `${theme}-${item.split(' ')[0]}` as keyof typeof childrenTemplates;
    const templates = childrenTemplates[templateKey];
    
    if (templates && templates[style as keyof typeof templates]) {
      return templates[style as keyof typeof templates].join('\n');
    }

    // Generic children's fallback
    return `${name}, here's a special poem for you,\nAbout ${item} and all they do!\n\nThey bring such joy and happiness,\nAnd fill your days with sweet success,\nWith wonder, magic, and delight,\nThey make everything just right!`;
  }

  private generateLearningFallback(name: string, style: string, learningTopic?: string): string {
    const learningTemplates = {
      "numbers": {
        playful: [
          `${name}, let's count from one to ten,`,
          `We'll count again and then again!`,
          `One little duck, two little bees,`,
          `Three pretty flowers, four tall trees.`,
          ``,
          `Five bright stars up in the sky,`,
          `Six birds learning how to fly,`,
          `Seven, eight, nine, and ten!`,
          `Now let's start counting once again!`
        ]
      },
      "alphabet": {
        playful: [
          `${name}, let's sing the ABC,`,
          `Come along and learn with me!`,
          `A is for apple, red and round,`,
          `B is for ball that bounces around.`,
          ``,
          `C is for cat who likes to play,`,
          `D is for dog who runs all day,`,
          `Letters are fun from A to Z,`,
          `Learning is as fun as fun can be!`
        ]
      },
      "colors": {
        playful: [
          `${name}, look around and you will see,`,
          `Colors everywhere for you and me!`,
          `Red like apples, blue like sky,`,
          `Yellow sunshine way up high.`,
          ``,
          `Green like grass beneath your feet,`,
          `Orange carrots, such a treat!`,
          `Purple flowers, pink so bright,`,
          `Colors make the world just right!`
        ]
      }
    };

    const topicTemplates = learningTemplates[learningTopic as keyof typeof learningTemplates];
    if (topicTemplates && topicTemplates[style as keyof typeof topicTemplates]) {
      return topicTemplates[style as keyof typeof topicTemplates].join('\n');
    }

    // Generic learning fallback
    const topicLabel = this.getLearningTopicLabel(learningTopic || "learning");
    return `${name}, let's learn about ${topicLabel.toLowerCase()},\nIt's going to be such fun for me and you!\n\nWe'll discover something new today,\nThrough this special learning way,\nWith rhythm, rhyme, and lots of cheer,\nLearning makes everything so clear!`;
  }
}

export const aiAgent = new AIAgent();