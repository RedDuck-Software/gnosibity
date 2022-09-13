import { Order } from '@bity/api/models';

type Currency = 'ETH' | 'BTC' | 'USDT';

export function createOrder(
  from: string,
  to: string,
  sendingCurrency: Currency,
  gettingCurrency: Currency,
  valueToSent: number,
  valueToGet: number,
): Promise<Order> {
  const order = new Order();
  return order
    .setInput(sendingCurrency, valueToSent.toString())
    .do((input) => input.setCryptoAddress(from))
    .setOutput(gettingCurrency, valueToGet.toString())
    .do((output) => output.setCryptoAddress(to))
    .generateObjectForOrderCreation();
}
