let current: {[key: string]: string};

export const setLocale = (language: string) => {
  switch(language) {
    default: current = require('./en.json');
  }
}

/**
 * Sends the value string for that key
 * @param key String
 */
export const t = (key: string) => {
  return current[key];
};