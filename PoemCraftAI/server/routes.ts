import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePoemSchema, insertPoemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate poem endpoint
  app.post("/api/poems/generate", async (req, res) => {
    try {
      const { eventType, names, style } = generatePoemSchema.parse(req.body);
      
      // This is where the AI would generate the poem
      // For now, we'll create a structured poem template
      const poem = generatePoemContent(eventType, names, style);
      
      // Save the generated poem
      const savedPoem = await storage.createPoem({
        eventType,
        names: names || "",
        style,
        content: poem,
      });
      
      res.json(savedPoem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate poem" });
      }
    }
  });

  // Get recent poems
  app.get("/api/poems/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const poems = await storage.getRecentPoems(limit);
      res.json(poems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent poems" });
    }
  });

  // Get specific poem
  app.get("/api/poems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoemById(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poem" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generatePoemContent(eventType: string, names: string = "", style: string): string {
  const namesList = names.split(",").map(n => n.trim()).filter(n => n);
  const primaryName = namesList[0] || "dear friend";
  
  const poemTemplates = {
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
        `And all your dreams come shining through.`,
        ``,
        `With candles bright and wishes near,`,
        `We hope this is your best year yet,`,
        `Happy Birthday, ${primaryName} dear,`,
        `A celebration you'll never forget!`
      ],
      playful: [
        `🎉 It's party time, hooray hooray!`,
        `${primaryName}'s birthday is here today!`,
        `Cake and presents, fun galore,`,
        `Let's celebrate and then some more!`,
        ``,
        `Dancing, singing, joy so bright,`,
        `Making memories all through the night,`,
        `Another year of awesome you,`,
        `Happy Birthday! Dreams come true! 🎂`
      ],
      elegant: [
        `In graceful years that gently flow,`,
        `Your wisdom and your beauty grow,`,
        `${primaryName}, on this day of birth,`,
        `We celebrate your gentle worth.`,
        ``,
        `May fortune smile upon your way,`,
        `And bless you on this special day,`,
        `With elegance that knows no end,`,
        `Happy Birthday, dearest friend.`
      ],
      humorous: [
        `Another year older, but who's counting?`,
        `(Okay, maybe the candles are mounting!)`,
        `${primaryName}, you're aging like fine wine,`,
        `Which means you're getting better with time!`,
        ``,
        `They say with age comes wisdom true,`,
        `But we love your silly side too,`,
        `So blow out those candles with a grin,`,
        `And let the birthday fun begin! 🎈`
      ]
    },
    wedding: {
      heartfelt: [
        `Two hearts that beat as one today,`,
        `${namesList.join(" and ") || "Two souls"} have found their perfect way,`,
        `In love's embrace, forever bound,`,
        `True happiness you both have found.`,
        ``,
        `May your journey together be blessed,`,
        `With joy, laughter, and sweet rest,`,
        `Through all of life's adventures new,`,
        `May love forever see you through.`,
        ``,
        `Congratulations on this day,`,
        `As you begin in love's sweet way,`,
        `May your marriage be a blessing true,`,
        `And happiness forever new.`
      ],
      elegant: [
        `In sacred bonds of love you stand,`,
        `${namesList.join(" and ") || "Two hearts"} united, hand in hand,`,
        `Before family, friends, and God above,`,
        `You pledge your everlasting love.`,
        ``,
        `May your union be a work of art,`,
        `Two souls becoming one in heart,`,
        `With grace and beauty, love so true,`,
        `Congratulations to both of you.`
      ]
    },
    graduation: {
      heartfelt: [
        `Knowledge gained and wisdom earned,`,
        `Through years of study, you have learned,`,
        `${primaryName}, today you stand so tall,`,
        `Ready to conquer, ready for all.`,
        ``,
        `Your dedication brought you here,`,
        `Through challenges faced without fear,`,
        `Now spread your wings and chase your dreams,`,
        `Nothing's impossible, or so it seems.`,
        ``,
        `Congratulations on this day,`,
        `As you begin your brand new way,`,
        `The world awaits your special gift,`,
        `Go forth and let your spirit lift!`
      ],
      playful: [
        `🎓 Caps off to you, graduate!`,
        `${primaryName}, you made it through the gate!`,
        `No more homework, no more tests,`,
        `Time to put your skills to the test!`,
        ``,
        `From student life to the real world,`,
        `Your future's bright, your flag unfurled,`,
        `So celebrate this awesome day,`,
        `Hip hip hooray, you're on your way! 🌟`
      ]
    },
    anniversary: {
      heartfelt: [
        `${namesList.join(" and ") || "Two hearts"} together through the years,`,
        `Through joy and laughter, hopes and tears,`,
        `Your love has grown stronger every day,`,
        `A testament to love's true way.`,
        ``,
        `Through seasons changed and time that's passed,`,
        `You've built a love that's meant to last,`,
        `Happy Anniversary to you both,`,
        `Who've honored love and sacred oath.`,
        ``,
        `May many more years bring you joy,`,
        `With love that nothing can destroy,`,
        `Here's to your love, so pure and true,`,
        `And all the happiness in view.`
      ],
      elegant: [
        `In love's eternal dance you've moved,`,
        `${namesList.join(" and ") || "Two souls"} whose bond time has proved,`,
        `Through years of grace and devotion true,`,
        `A love story written by you two.`,
        ``,
        `May your love continue to inspire,`,
        `With passion's flame and hearts on fire,`,
        `Happy Anniversary, dear ones,`,
        `Your love shines brighter than the suns.`
      ]
    }
  };

  const eventTemplates = poemTemplates[eventType as keyof typeof poemTemplates];
  if (!eventTemplates) {
    return `A special ${eventType} poem for ${primaryName || "you"}!\n\nMay this occasion bring you joy,\nAnd happiness that none can destroy,\nWith love and laughter all around,\nMay blessings in your life be found!`;
  }

  const styleTemplate = eventTemplates[style as keyof typeof eventTemplates];
  if (!styleTemplate) {
    return eventTemplates.heartfelt?.join('\n') || `A beautiful ${eventType} poem for ${primaryName}!`;
  }

  return styleTemplate.join('\n');
}
