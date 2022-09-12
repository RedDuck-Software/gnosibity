import { Order, Owner } from "@bity/api/models";

type Currency = 'ETH' | 'BTC';

export function createOrder(cryptoAddress: string | undefined, sendingCurrency : Currency, 
  gettingCurrency : Currency,
  valueToSent : number, valueToGet : number): Promise<Order> {
  if (typeof cryptoAddress === 'undefined'){
    const order = new Order();
    return Promise.resolve(order);
  }
  const order = new Order();
  return order
    .setInput(sendingCurrency, valueToSent.toString())
    .setOutput(gettingCurrency, valueToGet.toString())
    .do((output) =>
      output.setCryptoAddress(cryptoAddress)
    ).generateObjectForOrderCreation();
}
