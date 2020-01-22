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

    const { uniqueRating, similarCaption, similarCaptionId } = await this.validateUniqueness(caption, category);
    console.log('Unique_rating', uniqueRating);

    if (uniqueRating > 0.50) {
      const result = await db.query({
        text: 'INSERT INTO excuses(id, caption, category, user_id, unique_rating, similar_caption_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [generateRandomId(), caption, category, userId, uniqueRating, similarCaptionId],
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
      excuseArray: null,
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
    
    entry.excuseArray = result.rows;
    return entry;
  }

  async validateUniqueness(caption, category) {
    const { excuseArray } = await this.getExcusesByCategory(category);


    const targetCaptionsObject = {};
    
    excuseArray.forEach((entry) => {
      targetCaptionsObject[entry.caption] = entry;
    })
    
    const targetCaptions = Object.keys(targetCaptionsObject);
    // const targetCaptions = excuseArray.map((entry) => entry.caption);

    if (targetCaptions.length < 1 || excuseArray < 1) {
      return { uniqueRating: 1.0, similarCaption: 'First entry', similarCaptionId: null };
    }
    
    const matches = await stringSimilarity.findBestMatch(caption, targetCaptions);

    if (matches.bestMatch.rating > 0.70) {
      console.log('Caption not very unique');
    }

    const similarCaption = matches.bestMatch.target;
    const similarCaptionId = targetCaptionsObject[similarCaption].id;
    
    return { uniqueRating: 1.0 - matches.bestMatch.rating, similarCaption, similarCaptionId };
  }

  async getRandomExcuse() {
    const excuses = await this.getAllExcuses();

    console.log('Excuses', typeof excuses, excuses.length);

    if (excuses.length < 1 || excuses.length === undefined) {
      return 'There are currently no excuses in the database. Please submit one!'  
    } 

    return excuses[Math.floor(Math.random() * (excuses.length))].caption;
  }


}

export default new ExcuseService();