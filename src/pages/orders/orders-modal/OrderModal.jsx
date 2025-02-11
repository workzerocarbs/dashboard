import "../orders-modal/OrderModal.scss"; // Create a separate CSS file or use inline styles
import { useReceivedOrder } from "../../../context/ReceivedOrderContext";
import OrderModalItem from "./OrderModalItem";

function OrderModal() {
  const { receivedOrderedItems } = useReceivedOrder();

  // console.log(receivedOrderedItems);

  return (
    <div className="tw-fixed tw-inset-0 tw-flex tw-items-start tw-justify-center tw-bg-black tw-bg-opacity-50 tw-z-[10000] tw-overflow-y-auto ">
      {/*  <!-- Modal Container --> */}
      <div className="tw-bg-white tw-p-3 tw-rounded-md tw-shadow-md tw-max-w-md tw-w-full tw-text-black tw-overflow-y-scrol tw-my-11">
        <p className="tw-py-3 tw-font-semibold">
          <span>{receivedOrderedItems?.length} </span>
          <span>
            new {receivedOrderedItems?.length > 1 ? "orders" : "order"}
          </span>
        </p>
        {/*  <!-- Received Ordered Items --> */}
        {receivedOrderedItems?.map((receivedOrderedItem, index) => (
          <OrderModalItem
            key={index}
            receivedOrderedItem={receivedOrderedItem}
          />
        ))}
      </div>
    </div>
  );
}

export default OrderModal;
