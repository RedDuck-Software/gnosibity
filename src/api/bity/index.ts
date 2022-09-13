import { BityApiClientInterface } from '@bity/api';
import { OrderPaymentDetailsAll, PreparedOrder, URL, Order } from '@bity/api/models';

import { NotConnectedClientRequestError } from './errors';

import { getBityApiClient } from '../../helpers/connectBity';

export class UnconnectedBityApi {
  private static _instance: UnconnectedBityApi;

  public static getInstance(): UnconnectedBityApi {
    if (UnconnectedBityApi._instance) {
      return UnconnectedBityApi._instance;
    }

    UnconnectedBityApi._instance = new UnconnectedBityApi(getBityApiClient);
    return UnconnectedBityApi._instance;
  }

  private readonly getBityApiClientFn: () => Promise<BityApiClientInterface>;

  private constructor(
    getBityApiClientFn: () => Promise<BityApiClientInterface>,
  ) {
    this.getBityApiClientFn = getBityApiClientFn;
  }

  public connect(): Promise<BityApi> {
    return this.getBityApiClientFn().then((bityApiClient) =>
      BityApi.getInstance().setBityApiClient(bityApiClient),
    );
  }
}

export class BityApi {
  private bityApiClient: BityApiClientInterface | null = null;
  private static _instance: BityApi;

  public static getInstance(): BityApi {
    if (BityApi._instance) {
      return BityApi._instance;
    }

    BityApi._instance = new BityApi();

    return BityApi._instance;
  }

  public setBityApiClient(bityApiClient: BityApiClientInterface): this {
    this.bityApiClient = bityApiClient;
    return this;
  }

  private getClientOrThrow(): BityApiClientInterface {
    if (!this.bityApiClient) {
      throw new NotConnectedClientRequestError();
    }
    return this.bityApiClient;
  }

  public isConnected(): boolean {
    return !!this.bityApiClient;
  }

  public createOrder(preparedOrder: PreparedOrder): Promise<URL> {
    return this.getClientOrThrow().createOrder(preparedOrder);
  }

  public fetchOrderExchangeRate(preparedOrder: PreparedOrder): Promise<Order>{
    return this.getClientOrThrow().fetchEstimateForOrder(preparedOrder);
  }
  
  public fetchOrderWithUrl(orderUrl: URL): Promise<OrderPaymentDetailsAll> {
    return this.getClientOrThrow().fetchOrderWithUrl(orderUrl);
  }

  public fetchHistory(): Promise<OrderPaymentDetailsAll[]> {
    return this.getClientOrThrow().fetchOrders();
  }

  public verifySignature(
    orderRelativeUrl: URL,
    signature: string,
  ): Promise<void> {
    return this.getClientOrThrow().verifySignature(orderRelativeUrl, signature);
  }
}
