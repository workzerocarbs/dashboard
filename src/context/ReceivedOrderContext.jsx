import { createContext, useCallback, useContext, useState } from "react";

const ReceivedOrderContext = createContext();

function ReceivedOrderProvider({ children }) {
  const [toggleNotificationModal, setToggleNotificationModal] = useState(false);
  const [receivedOrderedItems, setReceivedOrderedItems] = useState([]); // State to store the order data got from the pusher callback
  const [preparingItems, setPreparingItems] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);

  const handleUpdateReceivedOrderedItems = useCallback(function (item) {
    setReceivedOrderedItems((curr) => [...curr, item]);
    setToggleNotificationModal(true);
  }, []);

  const handleUpdatePreparingItems = useCallback(function (itemID, timeToMake) {
    let newItem = null; // Reinitialized every time this function runs

    setReceivedOrderedItems((currReceivedItems) => {
      const updatedItems = currReceivedItems.filter((item) => {
        if (item.id === itemID) {
          newItem = item; // Capture the item before filtering
          return false; // Exclude the item
        }

        return true; // Keep the rest
      });

      // close modal if no items remain
      if (updatedItems.length === 0) setToggleNotificationModal(false);

      return updatedItems;
    });

    if (newItem) {
      setPreparingItems((currPreparingItems) => [
        ...currPreparingItems,
        { ...newItem, timeToMake },
      ]);
    }
  }, []);

  const handleUpdateRejectedOrders = useCallback(function (cancelReasonData) {
    // Storing cancel reason and order-id
    setRejectedOrders((currOrderCancelationReason) => [
      ...currOrderCancelationReason,
      cancelReasonData,
    ]);

    // Removing cancel item from received orders
    setReceivedOrderedItems((curr) =>
      curr.filter((item) => item.id !== cancelReasonData.orderID)
    );
  }, []);

  console.log("rejectedOrders", rejectedOrders);

  return (
    <ReceivedOrderContext.Provider
      value={{
        toggleNotificationModal,
        setToggleNotificationModal,
        receivedOrderedItems,
        handleUpdateReceivedOrderedItems,
        preparingItems,
        handleUpdatePreparingItems,
        handleUpdateRejectedOrders,
        rejectedOrders,
      }}
    >
      {children}
    </ReceivedOrderContext.Provider>
  );
}

function useReceivedOrder() {
  const context = useContext(ReceivedOrderContext);
  if (context === undefined)
    throw new Error(
      "ReceivedOrderProvider was used outside of ReceivedOrderContext"
    );

  return context;
}

export { ReceivedOrderProvider, useReceivedOrder };
