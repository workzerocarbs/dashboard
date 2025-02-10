import { useState } from "react";
import { formatCurrency, formattedDateTime } from "../../../utils/helper";
import { TfiPrinter } from "react-icons/tfi";
import { printReceipt } from "../../../utils/printReceipt";
import { useReceivedOrder } from "../../../context/ReceivedOrderContext";

const orderCancelationReason = [
  "Raw Material/Items Out of Stock",
  "High Order Rush / Kitchen is Full",
  "Kitchen Staff Not Available",
  "Nearing Closing Time",
  "Outlet Timings Are Not Correct",
  "Temporarily Closed",
  "Issues with Menu",
  "Others",
];

function OrderModalItem({ receivedOrderedItem }) {
  const { handleUpdatePreparingItems } = useReceivedOrder();
  const [minutesToPrepare, setMinutesToPrepare] = useState(22);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [cancelationReason, setCancelationReason] = useState("");

  // console.log(receivedOrderedItem);

  function handleOpenRejectionConfirmation() {
    setIsConfirmationModalOpen(true);
  }
  function handleConfirmRejection() {
    if (cancelationReason) {
      console.log("REJECTED");
      // THE CODE TO REMOVE THE REJECTED OBJECT FROM THE STATE GOES HERE
      setIsConfirmationModalOpen(false);
      setCancelationReason("");
    }
  }
  function handleCancelRejection() {
    setIsConfirmationModalOpen(false);
    setCancelationReason("");
  }

  return (
    <div className="tw-border tw-rounded-lg tw-mb-9">
      <p className="tw-text-sm tw-pl-4 tw-bg-[#8CC707] tw-rounded-t-lg tw-uppercase tw-font-semibold tw-text-[#466822]">
        Zero Carbs
      </p>
      <div className="tw-flex tw-gap-3 tw-py-5 tw-px-3">
        <p className="tw-text-sm tw-font-light">ID: {receivedOrderedItem.id}</p>
        <div className="tw-border-l tw-border-black"></div>
        <p className="tw-text-sm tw-font-light">
          {formattedDateTime(receivedOrderedItem.updated_at)}
        </p>
        <p className="tw-text-sm tw-font-light tw-ml-auto tw-uppercase">
          <span> Ordered by </span>
          <span className="tw-font-semibold">{receivedOrderedItem.phone}</span>
        </p>
      </div>
      <hr className="tw-mx-3" />
      <div className="tw-py-5 tw-px-3">
        {/* <!-- Items - Quantity, Price and Name --> */}
        <div className="tw-flex tw-flex-col tw-gap-2">
          {receivedOrderedItem?.order_summary?.map((item) => {
            const addonItems = JSON.parse(item?.addon_data)[0]?.items || [];
            const formattedAddons = addonItems
              .map((addon) => `${addon.quantity} x ${addon.addon_item_name}`)
              .join(", ");

            const addonItemTotalPrice = addonItems.reduce(
              (acc, addon) => addon.total + acc,
              0
            );

            return (
              <div key={item.id}>
                <div className="tw-grid tw-grid-cols-[1fr_auto] tw-gap-x-4 tw-w-full">
                  {/* Left Side: Quantity, Item Name & Addons */}
                  <div>
                    <div className="tw-flex tw-items-center tw-gap-1.5">
                      <img
                        src={
                          item.item[0]?.type === "veg"
                            ? "/veg.svg"
                            : "/non-veg.svg"
                        }
                        alt={
                          item.item[0]?.type === "veg"
                            ? "veg-img"
                            : "non-veg-img"
                        }
                        className="tw-h-4"
                      />
                      <p className="tw-text-sm">
                        <span>{item?.qty} × </span>
                        <span>{item.item[0]?.name}</span>
                      </p>
                    </div>

                    {/* Addons - Display below the item name */}
                    {formattedAddons && (
                      <p className="tw-text-xs tw-text-gray-700 tw-pl-6 tw-break-words tw-py-2">
                        <span className="tw-font-semibold tw-text-black">
                          Add On:
                        </span>
                        <span> {formattedAddons}</span>
                      </p>
                    )}
                  </div>

                  {/* Right Side: Price */}
                  <p className="tw-text-sm tw-text-right">
                    {formatCurrency(+item.item[0]?.price + addonItemTotalPrice)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* <!-- Cooking Details--> */}
        {receivedOrderedItem?.extra_cooking_advice && (
          <p className="tw-text-xs tw-ml-4 tw-px-2 tw-py-1 tw-bg-orange-100 tw-my-2 tw-rounded-md tw-font-semibold tw-border tw-border-orange-200 tw-text-yellow-700">
            {receivedOrderedItem?.extra_cooking_advice}
          </p>
        )}
      </div>
      <hr className="tw-mx-3" />
      <div className="tw-py-2 tw-px-3 tw-text-stone-500 tw-text-sm ">
        {/* <!-- Number of Items and Grand Total Price --> */}
        <div className="tw-flex tw-justify-between tw-w-full">
          <p>
            <span>{receivedOrderedItem?.order_summary?.length}</span>
            <span>
              {receivedOrderedItem?.order_summary?.length > 1
                ? " items"
                : " item"}
            </span>
          </p>
          <p>{formatCurrency(receivedOrderedItem?.item_total)}</p>
        </div>
        {/* <!-- Taxes --> */}
        <div className="tw-flex tw-justify-between tw-w-full">
          <p className="tw-underline tw-decoration-dotted tw-underline-offset-4">
            Taxes
          </p>
          <p>{formatCurrency(receivedOrderedItem?.tax_amount)}</p>
        </div>
        {/* <!-- Packing Charges --> */}
        <div className="tw-flex tw-justify-between tw-w-full">
          <p className="tw-underline tw-decoration-dotted tw-underline-offset-4">
            Packing Charges
          </p>
          <p>{formatCurrency(receivedOrderedItem?.packaging_charge)}</p>
        </div>
        {/* <!-- Discount --> */}

        <div className="tw-flex tw-justify-between tw-w-full">
          <p className="tw-underline tw-decoration-dotted tw-underline-offset-4">
            Discount
          </p>
          <p>-{formatCurrency(0.0)}</p>
        </div>
      </div>
      <hr className="tw-mx-3" />

      {/* <!--Total Bill Amount and Payment Method --> */}
      <div className="tw-py-2 tw-px-3 tw-font-medium tw-text-stone-600">
        <div className="tw-flex tw-justify-between tw-w-full">
          <p className="tw-flex tw-gap-4 tw-items-center">
            <span>Total Bill</span>

            {receivedOrderedItem?.payment_mode === 1 && (
              <span className="tw-border tw-px-1 tw-rounded-md tw-text-sm tw-uppercase tw-border-red-400 tw-text-red-400">
                Unpaid
              </span>
            )}
            {receivedOrderedItem?.payment_mode === 2 && (
              <span className="tw-border tw-px-1 tw-rounded-md tw-text-sm tw-uppercase tw-border-[#8CC707] tw-text-[#8CC707]">
                Paid
              </span>
            )}
          </p>
          <p>{formatCurrency(receivedOrderedItem?.grand_total)}</p>
        </div>
      </div>
      <hr className="tw-mx-3" />

      <div className="tw-py-2 tw-px-3 ">
        <div className="tw-flex tw-justify-between tw-items-center ">
          <p className="tw-text-sm tw-font-semibold tw-text-stone-500">
            Set food preparation time
          </p>
          {/* <!-- Print Order Receipt --> */}
          <div className="tw-flex tw-gap-4 tw-items-center tw-font-medium">
            <button
              onClick={() => printReceipt(receivedOrderedItem)}
              className="tw-flex tw-items-center tw-gap-1 tw-border tw-p-1 tw-rounded-md tw-border-blue-600 tw-text-blue-600 tw-text-sm"
            >
              <TfiPrinter />
              <span>Print Order</span>
            </button>
          </div>
        </div>

        {/* <!-- Timer for order preparation --> */}
        <div className="tw-flex tw-border tw-mt-5 tw-justify-evenly tw-items-center tw-rounded-md tw-border-black">
          {/* <!-- Minus Button --> */}
          <button
            onClick={() => setMinutesToPrepare((currMin) => (currMin -= 1))}
            className="tw-px-4 tw-border-r tw-text-center  tw-flex-grow tw-border-black tw-text-blue-600 tw-font-semibold tw-text-xl hover:tw-bg-stone-200 hover:tw-rounded-l-md"
          >
            &minus;
          </button>
          {/* <!-- Minutes  --> */}
          <p className="tw-px-4 tw-text-stone-600 tw-flex-grow tw-text-center">
            {minutesToPrepare} min
          </p>
          {/* <!-- Plus Button --> */}
          <button
            onClick={() => setMinutesToPrepare((currMin) => (currMin += 1))}
            className="tw-px-4 tw-border-l tw-border-black tw-text-blue-600 tw-font-semibold tw-text-xl tw-flex-grow hover:tw-bg-stone-200 hover:tw-rounded-r-md"
          >
            &#x2B;
          </button>
        </div>
      </div>

      <hr className="tw-mt-7 tw-mb-4" />

      {/* <!-- Accept and Reject Button */}
      <div className="tw-py-4 tw-px-6 tw-flex tw-items-center tw-gap-4 tw-text-sm">
        <button
          onClick={handleOpenRejectionConfirmation}
          className="tw-px-4 tw-py-2 tw-border tw-border-red-800 tw-rounded-md tw-text-red-800 hover:tw-bg-red-600 hover:tw-text-white tw-transition-all tw-duration-200"
        >
          Reject
        </button>
        <button
          onClick={() => handleUpdatePreparingItems(receivedOrderedItem?.id)}
          className="tw-border tw-border-[#8CC707] tw-px-4 tw-py-2 tw-flex-grow tw-rounded-md tw-bg-[#8CC707] tw-text-white hover:tw-bg-[#8dc707d5] hover:tw-text-black tw-transition-all tw-duration-200"
        >
          Accept order
        </button>
      </div>

      {/* <-- Confirmation Modal for Rejecting an Order -->  */}
      {isConfirmationModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-[1100]">
          <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg tw-text-center tw-w-80">
            <p className="tw-mb-4 tw-text-sm tw-font-medium">
              <span> Select a reason for order cancellation of </span>
              <span className="tw-font-semibold">
                Order ID {receivedOrderedItem?.id} :
              </span>
            </p>
            <div className="tw-py-3 tw-flex tw-gap-2 tw-flex-col">
              {orderCancelationReason?.map((value, index) => (
                <div
                  key={index}
                  className="tw-flex tw-justify-between tw-text-sm tw-items-center"
                >
                  <label htmlFor={value}>{value}</label>
                  <input
                    key={index}
                    type="radio"
                    name={value}
                    id={value}
                    value={value}
                    checked={cancelationReason === value}
                    onClick={() => setCancelationReason(value)}
                  />
                </div>
              ))}
            </div>
            <div className="tw-mt-5 tw-flex tw-justify-between tw-gap-4">
              <button
                onClick={handleConfirmRejection}
                className="tw-bg-red-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-md hover:tw-bg-red-700 tw-transition"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelRejection}
                className="tw-border tw-border-gray-400 tw-px-3 tw-py-1 tw-rounded-md hover:tw-bg-gray-200 tw-transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderModalItem;
