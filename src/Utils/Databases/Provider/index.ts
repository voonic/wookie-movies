import Realm from 'realm';
import {FavoriteSchema} from '../../../Models/Favorite';
import {MovieSchema} from '../../../Models/Movie';

var realm: Realm;

export default class Provider {
  static async init(): Promise<void> {
    realm = await Realm.open({
      path: "wookiemovies",
      schema: [MovieSchema, FavoriteSchema],
      schemaVersion: 1.0,
    });
  }

  static close(): void {
    if (realm && !realm.isClosed) {
      realm.close();
    }
  }

  static get(): Realm {
    return realm;
  }
}