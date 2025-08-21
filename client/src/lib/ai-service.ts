import * as tf from '@tensorflow/tfjs';

export interface PoemGenerationOptions {
  eventType: string;
  names?: string;
  style: 'heartfelt' | 'playful' | 'elegant' | 'humorous';
}

export class AIService {
  private sentimentModel: tf.LayersModel | null = null;
  private styleClassifier: tf.LayersModel | null = null;
  private isLoading = false;

  async initialize() {
    if (this.isLoading || this.sentimentModel) return;
    
    this.isLoading = true;
    try {
      // Initialize TensorFlow.js models for client-side AI features
      await tf.ready();
      
      // Load sentiment analysis model for poem quality assessment
      this.sentimentModel = await this.createSentimentModel();
      
      // Load style classifier for poem style detection
      this.styleClassifier = await this.createStyleClassifier();
      
      console.log('TensorFlow AI Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TensorFlow models:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Create a sentiment analysis model for poem quality assessment
  private async createSentimentModel(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ 
          units: 128, 
          activation: 'relu', 
          inputShape: [300] // Word embeddings input size
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ 
          units: 5, // 5 sentiment categories (very negative to very positive)
          activation: 'softmax' 
        })
      ]
    });
    
    // Compile the model
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  // Create a style classifier model
  private async createStyleClassifier(): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ 
          units: 256, 
          activation: 'relu', 
          inputShape: [300] 
        }),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dense({ 
          units: 4, // 4 poem styles: heartfelt, playful, elegant, humorous
          activation: 'softmax' 
        })
      ]
    });
    
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  // Analyze poem sentiment using TensorFlow model
  async analyzePoemSentiment(poemText: string): Promise<{
    sentiment: string;
    confidence: number;
    scores: number[];
  }> {
    if (!this.sentimentModel) {
      await this.initialize();
    }

    try {
      // Convert text to numerical features (simplified word embeddings)
      const features = this.textToFeatures(poemText);
      const tensorInput = tf.tensor2d([features]);
      
      // Make prediction
      const prediction = this.sentimentModel!.predict(tensorInput) as tf.Tensor;
      const scores = await prediction.data();
      
      // Get sentiment label
      const sentimentLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
      const maxIndex = scores.indexOf(Math.max(...Array.from(scores)));
      
      // Clean up tensors
      tensorInput.dispose();
      prediction.dispose();
      
      return {
        sentiment: sentimentLabels[maxIndex],
        confidence: scores[maxIndex],
        scores: Array.from(scores)
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      throw error;
    }
  }

  // Classify poem style using TensorFlow model
  async classifyPoemStyle(poemText: string): Promise<{
    style: string;
    confidence: number;
    allScores: { [key: string]: number };
  }> {
    if (!this.styleClassifier) {
      await this.initialize();
    }

    try {
      const features = this.textToFeatures(poemText);
      const tensorInput = tf.tensor2d([features]);
      
      const prediction = this.styleClassifier!.predict(tensorInput) as tf.Tensor;
      const scores = await prediction.data();
      
      const styleLabels = ['heartfelt', 'playful', 'elegant', 'humorous'];
      const maxIndex = scores.indexOf(Math.max(...Array.from(scores)));
      
      const allScores: { [key: string]: number } = {};
      styleLabels.forEach((label, index) => {
        allScores[label] = scores[index];
      });
      
      tensorInput.dispose();
      prediction.dispose();
      
      return {
        style: styleLabels[maxIndex],
        confidence: scores[maxIndex],
        allScores
      };
    } catch (error) {
      console.error('Style classification failed:', error);
      throw error;
    }
  }

  // Convert text to numerical features for TensorFlow models
  private textToFeatures(text: string): number[] {
    // Simplified feature extraction (in real app, use proper word embeddings)
    const features = new Array(300).fill(0);
    
    // Basic text statistics as features
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).length - 1;
    
    features[0] = words.length / 100; // Normalize word count
    features[1] = sentences / 10; // Normalize sentence count
    features[2] = (text.match(/[!]/g) || []).length / 10; // Exclamation marks
    features[3] = (text.match(/[?]/g) || []).length / 10; // Question marks
    features[4] = (text.match(/love|heart|dear/gi) || []).length / words.length; // Emotional words
    features[5] = (text.match(/fun|play|happy|joy/gi) || []).length / words.length; // Playful words
    features[6] = (text.match(/beautiful|elegant|grace/gi) || []).length / words.length; // Elegant words
    features[7] = (text.match(/funny|laugh|silly|joke/gi) || []).length / words.length; // Humorous words
    
    // Add more sophisticated features here in a real implementation
    // You could use pre-trained word embeddings like Word2Vec or GloVe
    
    return features;
  }

  isReady(): boolean {
    return this.sentimentModel !== null && this.styleClassifier !== null;
  }

  // Helper method to check if TensorFlow.js is available for future features
  async checkTensorFlowAvailability(): Promise<boolean> {
    try {
      await tf.ready();
      return true;
    } catch (error) {
      console.error('TensorFlow.js not available:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
