/**
 * A cancellable network request maker. Can be used to make get and post
 * request.
 */
export enum METHOD {GET = 'get', POST = 'post'};

export interface RequestProps {
  url: string,
  method?: METHOD,
  data?: JSON,
};

export interface RequestParams {
  method: METHOD,
  headers: any,
  body? : string,
};

export default class Request {
  private cancelled: boolean = false;
  private props: RequestProps;

  constructor(props: RequestProps) {
    this.props = props;
  }

  /**
   * Fetches the data as json from the provided URL.
   * @returns Promise<any>
   */
  fetchJson = () : Promise<any> => {
    this.cancelled = false;
    let {url, method = METHOD.GET, data} = this.props;
    let requestParams: RequestParams = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Wookie2019',
      },
    };
    if (data && method === METHOD.POST) {
      requestParams.body = JSON.stringify(data);
    }
    return new Promise((resolve, reject) => {
      fetch(url, requestParams).then((response) => {
        if (this.cancelled) {
          reject({cancelled: true});
        } else {
          response.json().then((json) => {
            resolve(json);
          }).catch((error) => reject(error));
        }
      }).catch((error) => {
        this.cancelled ? reject({cancelled: true}) : reject(error);
      });
    });
  };

  /**
   * Cancels the existing ongoing request. Use it to cancel the request when
   * component is unmounted.
   */
  cancel = () => {
    this.cancelled = true;
  }

  /**
   * Updates the props, this way methods and urls can be changed
   * @param props 
   */
  setProps = (props: RequestProps) => {
    this.props = props;
  }
}