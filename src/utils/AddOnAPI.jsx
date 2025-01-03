import axios from 'axios';
import apiClient, { base_url, endpoints, token } from "../api/ApiConfig";


// create new addon
export const createAddOn = async (formData,groupName,quantity) => {
    const data = new FormData();
  
    // Validate input
    // if (!formData || formData.length === 0) {
    //   throw new Error("No add-on data provided");
    // }
  
    // Add group name 
    data.append("add_on_group_name", groupName);
    data.append("add_on_group_max_quantity", quantity);
    
    // Add quantity information
    // data.append("max_quantity", formData[0].quantity || 1);
  
    // Add add-on items
    formData.forEach((item, index) => {
      // Validate required fields
      if (!item.add_on_name || !item.add_on_type || !item.add_on_price) {
        console.warn(`Skipping incomplete add-on item at index ${index}`, item);
        return; // Skip this iteration if required fields are missing
      }
  
      // Append required fields
      data.append(`add_on_group_items[${index}][name]`, item.add_on_name);
      data.append(`add_on_group_items[${index}][type]`, item.add_on_type);
      data.append(`add_on_group_items[${index}][price]`, item.add_on_price);
  
      // Add image only if a valid file exists
      if (item.file instanceof File) {
        data.append(`add_on_group_items[${index}][image]`, item.file);
      }
    });
  
    // Debugging FormData
    // if (process.env.NODE_ENV === 'development') {
    //   for (let pair of data.entries()) {
    //     console.log(pair[0] + ": " + pair[1]);
    //   }
    // }
  
    try {
      const response = await axios.post(`${base_url}${endpoints.createAddOn}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      if(response.status == 200 || response.status == 201){
        return "ok";
      }
      return response.data;
    } catch (error) {
      console.error("Error submitting add-on data:", error.response?.data || error.message);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.message || "Failed to create add-on group");
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error preparing add-on group submission");
      }
    }
  };


  // Get all Addons
  export const getAllAddOns = async () => {
    try {
      const response = await axios.get(`${base_url}${endpoints.getAllAddOns}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log("error while getting all add on data", error);
      throw error;
    }
  };


  //Add addon to item

  export const addAddon = async (itemId , checkedAddons) =>{
    const data = {
      item_id: itemId,
      addon_groups: checkedAddons
  }
    try {
      const response = await axios.post(`${base_url}${endpoints.addAddOnToItem}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.status == 200 || 201){
        return "ok";
      }
      else{
        return "notok"
      }
    } catch (error) {
      console.log("error while adding add on",error)
    }
  }

    //Remove addon to item

    export const removeAddOn = async (itemId , unselectedAddOns) =>{
      const data = {
        item_id: itemId,
        addon_groups: unselectedAddOns
    }
      try {
        const response = await axios.post(`${base_url}${endpoints.removeAddonFromItem}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if(response.status == 200 || 201){
          return "ok";
        }
        else{
          return "notok"
        }
      } catch (error) {
        console.log("error while adding add on",error)
      }
    }