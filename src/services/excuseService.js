import config from '../config';
import db from '../db';
import uuidv4 from 'uuid/v4';
import stringSimilarity from 'string-similarity';

const activeCategories = ['medical', 'social', 'family'];

const generateRandomId = () => uuidv4();

class ExcuseService {

  async createExcuse(excuseBody) {
    const { caption, category, userId } = excuseBody;

    const entry = { 
      excuse: null,
      added: false,
      statusMessage: null,
    };

    if (activeCategories.indexOf(category) === -1) {
      entry.statusMessage = "Category is not supported";
      return entry;
    }

    const { uniqueRating, similarCaption } = await this.validateUniqueness(caption, category);
    console.log('Unique_rating', uniqueRating);

    if (uniqueRating > 0.50) {
      const result = await db.query({
        text: 'INSERT INTO excuses(id, caption, category, user_id, unique_rating) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [generateRandomId(), caption, category, userId, uniqueRating],
      });
  
      entry.excuse = result.rows[0]
      entry.added = true;
      entry.statusMessage = 'Excuse successfully added';
      return entry;   
    }

    entry.statusMessage = 'Excuse did not pass unique check';
    return entry;
  }

  async getAllExcuses() {
    const result = await db.query({
      text: 'SELECT * FROM excuses',
    });

    return result.rows;   
  }

  async getExcusesByCategory(category) {
    const entry = { 
      excuse: null,
      statusMessage: null,
    };

    if (activeCategories.indexOf(category) === -1) {
      entry.statusMessage = "Category is not supported";
      return entry;
    }
    const result = await db.query({
      text: 'SELECT id, caption, category, unique_rating, approved, rejected FROM excuses WHERE category = $1',
      values: [category],
    });
    
    entry.excuse = result.rows;
    return entry;
  }

  async validateUniqueness(caption, category) {
    const excusePool = await db.query({
      text: 'SELECT * FROM excuses WHERE category = $1',
      values: [category],
    });

    const targetCaptions = excusePool.rows.map((entry) => entry.caption);

    if (targetCaptions.length < 1) {
      return { unique_rating: 1.0, similarCaption: 'First entry' };
    }
    
    const matches = await stringSimilarity.findBestMatch(caption, targetCaptions);

    if (matches.bestMatch.rating > 0.70) {
      console.log('Caption not very unique');
    } 
    
    return { uniqueRating: 1.0 - matches.bestMatch.rating, similarCaption: matches.bestMatch.target };
  }

  async getRandomExcuse() {
    const excuses = await this.getAllExcuses();

    return excuses[Math.floor(Math.random() * (excuses.length))].caption;
  }


}

export default new ExcuseService();