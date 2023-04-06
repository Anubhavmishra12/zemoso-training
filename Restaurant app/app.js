// perform search fumction for a menu list
function searchMenu() {
    var input, filter, li, i;
    input = document.getElementById("menuSearch");
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName("menu-items");
    for (i = 0; i < li.length; i++) {
      if (li[i].innerText.toUpperCase().includes(filter)) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
//  perform search function for a list of table
  function searchTables() {
    var input, filter, li, i;
    input = document.getElementById("tablesSearch");
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName("table-name-tag");
    for (i = 0; i < li.length; i++) {
      if (li[i].innerText.toUpperCase().includes(filter)) {
        li[i].parentNode.style.display = "";
      } else {
        li[i].parentNode.style.display = "none";
      }
    }
  }
  //use for extracting item name and price from html
  function getPriceFromMenu(temp) {
    let endingIndex = temp.indexOf("</p>");
    let startingIndex = endingIndex - 6;
  
    return temp.substring(startingIndex, endingIndex);
  }
  function getItemNameFromMenu(temp) {
    let startingIndex = temp.indexOf("<h2>");
    let endingIndex = temp.indexOf("</h2>");
  
    return temp.substring(startingIndex + 4, endingIndex);
  }
//   drag functionality
  document.addEventListener("dragstart", function (event) {
    //type of data is dragged
    event.dataTransfer.setData("Text", event.target.id);
    var data = event.dataTransfer.getData("Text");
  
    let temp = event.target.innerHTML;/*Html content is dragged and stores in temp */
  
    let price = getPriceFromMenu(temp);//call the function and extract the html string stores in price
  
    let itemName = getItemNameFromMenu(temp);//same as up ones and stores in itemName
  
    localStorage.setItem("price", price);
    localStorage.setItem("current-item", itemName);
    localStorage.setItem(itemName, price);
  });
  
  document.addEventListener("dragenter", function (event) {
    if (event.target.className == "table") {
      event.target.style.border = "3px solid red";
    }
  });
  
  document.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  
  document.addEventListener("dragleave", function (event) {
    if (event.target.className == "table") {
      event.target.style.border = "";
    }
  });
  
  function getPriceAttributeOfTable(temp) {
    let priceIdStartingIndex = temp.indexOf("total");
    let priceIdEndingIndex = temp.indexOf("price") + 7;
    return temp.substring(priceIdStartingIndex, priceIdEndingIndex);
  }
  
  function getTableNameFromTable(temp) {
    let tableNameStartIndex = temp.indexOf("</h2>") - 7;
    let tableNameEndIndex = temp.indexOf("</h2>");
    return temp.substring(tableNameStartIndex, tableNameEndIndex);
  }
  
  function getTotalItemsAttributeFromTable(temp) {
    let itemsStartingIndex = temp.indexOf("total-items");
    let itemsEndingIndex = temp.indexOf("total-items") + 13;
    return temp.substring(itemsStartingIndex, itemsEndingIndex);
  }
  
  document.addEventListener("drop", function (event) {
    event.preventDefault();
    var arr = [];
    var data = event.dataTransfer.getData("Text");
  
    if (event.target.className == "table") {
      let temp = event.target.innerHTML;
  
      let itemsId = getTotalItemsAttributeFromTable(temp);
      let itemsCount = Number(document.getElementById(itemsId).innerHTML);
  
      let tableName = getTableNameFromTable(temp).toLowerCase();
  
      let currentItem = localStorage.getItem("current-item");
  
      let priceId = getPriceAttributeOfTable(temp);
  
      let existingPrice = document.getElementById(priceId).innerHTML;
  
      let itemsInLocalStorage = [];
      if (existingPrice === "0") {
        arr.push(currentItem);
        localStorage.setItem(tableName, JSON.stringify(arr));
        arr = [];
        localStorage.setItem(tableName + "-" + currentItem + "-count", 1);
        itemsCount = 1;
      } else {
        itemsInLocalStorage.push(JSON.parse(localStorage.getItem(tableName)));
  
        if (itemsInLocalStorage[0].indexOf(currentItem) === -1) {
          itemsInLocalStorage[0].push(currentItem);
          localStorage.setItem(tableName, JSON.stringify(itemsInLocalStorage[0]));
          itemsCount = itemsInLocalStorage[0].length;
          localStorage.setItem(tableName + "-" + currentItem + "-count", 1);
        }
      }
  
      console.log("itemsInLocalStorage:" + itemsInLocalStorage[0]);
  
      let presentPrice = localStorage.getItem("price");
      console.log("Dropped Item Price: " + presentPrice);
  
      let newPrice = Number(existingPrice) + Number(presentPrice);
  
      document.getElementById(priceId).innerHTML = newPrice;
      document.getElementById(itemsId).innerHTML = itemsCount;
  
      localStorage.setItem(tableName + "-total-price", newPrice);
      event.target.style.border = "";
    }
  });
  
  function updateData() {
    let items = document.getElementsByClassName("table");
    for (i = 0; i < items.length; i++) {
      let temp = items[i].innerHTML;
      let tableName = getTableNameFromTable(temp).toLowerCase();
      let totalPrice = localStorage.getItem(tableName + "-total-price");
      if (localStorage.getItem(tableName) === null) {
        document.getElementById("total-price-" + (i + 1)).innerHTML = 0;
        document.getElementById("total-items-" + (i + 1)).innerHTML = 0;
      }
      if (totalPrice === null) {
        continue;
      }
      let totalItems = JSON.parse(localStorage.getItem(tableName));
      document.getElementById("total-price-" + (i + 1)).innerHTML = totalPrice;
      document.getElementById("total-items-" + (i + 1)).innerHTML =
        totalItems.length;
    }
  }
  
  let tEvent = document.getElementsByClassName("table");
  let tableName;
  for (i = 0; i < tEvent.length; i++) {
    let thisEvent = tEvent[i];
    tEvent[i].addEventListener("click", function fireOrdersList() {
      let temp = thisEvent.innerHTML;
      let tableNameStartIndex = temp.indexOf("</h2>") - 7;
      let tableNameEndIndex = temp.indexOf("</h2>");
  
      tableName = temp.substring(tableNameStartIndex, tableNameEndIndex);
  
      document.getElementById("table-no").innerHTML = tableName;
      console.log(tableName);
      loadOrders();
    });
  }
  
  document.getElementById("close-button").addEventListener("click", function () {
    document.getElementById("order-details").style.opacity = 0;
    document.getElementById("container").style.opacity = 1;
    document.getElementById(tableName.toLowerCase()).style.backgroundColor =
      "white";
  });
  
  function loadOrders() {
    let tableItems = [];
    tableItems = JSON.parse(localStorage.getItem(tableName.toLowerCase()));
    console.log("tableItems= " + tableItems);
    if (tableItems !== null) {
      document.getElementById("container").style.opacity = 0.5;
      document.getElementById(tableName.toLowerCase()).style.backgroundColor =
        "yellow";
      document.getElementById("order-details").style.opacity = 1;
      document.getElementById("order-details").style.visibility = "visible";
      document.getElementById("check-out").style.visibility = "hidden";
      $("#orders").empty();
      if ($("#orders").is(":empty")) {
        let columns =
          "<tr><th>S.No</th><th>Item</th><th>Price</th><th style='opacity: 0'>.</th><th style='opacity: 0; width: 20px'>.</th></tr>";
        $(columns).appendTo("#orders");
      }
      let order = "";
      for (i = 0; i < tableItems.length; i++) {
        let price = localStorage.getItem(tableItems[i]);
        let itemServings = localStorage.getItem(
          tableName.toLowerCase() + "-" + tableItems[i] + "-count"
        );
        console.log(itemServings);
        if (itemServings >= 1) {
          order +=
            "<tr id='" +
            tableItems[i] +
            "'> <th style=' font-size: small; font-weight: 500; width:5%'>" +
            (i + 1) +
            "</th><th style='font-size: small; font-weight: 500; width:25%'>" +
            tableItems[i] +
            "</th><th style='font-weight: 500'>" +
            price +
            "</th> <th style='text-align: left'><p style='font-size: xx-small; margin-bottom: 0' class='servings'>Number of Servings</p><input type='number' id='quantity' name='count' class='counter-" +
            tableName.toLowerCase() +
            "' onchange='changeServings(event)' value='" +
            itemServings +
            "' min=1 style='border-top: none; border-left: none; border-right: none; border-bottom: 1px solid rgb(63, 62, 62);'/></th><th onclick='onDelete(event)'><i class='fas fa-trash'></i></th></tr>";
        } else {
          order +=
            "<tr id='" +
            tableItems[i] +
            "'> <th style=' font-size: small; font-weight: 500; width:5%'>" +
            (i + 1) +
            "</th><th style='font-size: small; font-weight: 500; width:25%'>" +
            tableItems[i] +
            "</th><th style='font-weight: 500'>" +
            price +
            "</th> <th style='text-align: left'><p style='font-size: xx-small; margin-bottom: 0' class='servings'>Number of Servings</p><input type='number' id='quantity' name='count' class='counter-" +
            tableName.toLowerCase() +
            "' onchange='changeServings(event)' value=1 min=1 style='border-top: none; border-left: none; border-right: none; border-bottom: 1px solid rgb(63, 62, 62);'/></th><th onclick='onDelete(event)'><i class='fas fa-trash'></i></th></tr>";
        }
      }
      $(order).appendTo("#orders");
      let newtotalPrice =
        "<tr><th></th><th></th><th style='font-size: small; font-weight: 500 '>Total: <span id='total-price'>0.00</span></th></tr>";
      $(newtotalPrice).appendTo("#orders");
      let totalactualPrice = localStorage.getItem(
        tableName.toLowerCase() + "-total-price"
      );
  
      document.getElementById("total-price").innerHTML = totalactualPrice;
    } else {
      alert("you dont have any current orders on this table");
    }
  }
  
  function getItemNameFromOrders(row) {
    let itemsStartingIndex = row.indexOf("25%") + 5;
    let thIndex = row.indexOf("</th>");
    let itemsEndingIndex = row.indexOf("</th>", thIndex + 1);
    return row.substring(itemsStartingIndex, itemsEndingIndex);
  }
  
  function onDelete(event) {
    let deletingOrderTableName = event.srcElement.parentNode.parentNode.id;
    let tableNo = document.getElementById("table-no").innerHTML.toLowerCase();
    console.log("onDeleteTable" + tableNo);
    let row = document.getElementById(deletingOrderTableName).innerHTML;
    let name = getItemNameFromOrders(row);
    console.log(name);
  
    let jsonObject = JSON.parse(localStorage.getItem(tableNo));
    console.log(jsonObject.indexOf(name));
    jsonObject.splice(jsonObject.indexOf(name), 1);
    localStorage.setItem(tableNo, JSON.stringify(jsonObject));
    loadOrders();
    updateData();
    localStorage.setItem(tableNo + "-" + name + "-count", 0);
    updateTotalPrice(tableNo);
  }
  
  function changeServings(event) {
    let value = event.target.value;
    console.log("Servings values =" + value);
    let servingsTable = event.target.parentNode.parentNode.id;
    let tableNo = document.getElementById("table-no").innerHTML.toLowerCase();
    let row = document.getElementById(servingsTable).innerHTML;
    let ItemName = getItemNameFromOrders(row);
    console.log(ItemName);
  
    let itemPrice = localStorage.getItem(ItemName);
    console.log(itemPrice);
  
    localStorage.removeItem(tableNo + "-total-price");
    localStorage.setItem(tableNo + "-" + ItemName + "-count", value);
    updateTotalPrice(tableNo);
  }
  
  function updateTotalPrice(tableNo) {
    let tableItems = [];
    tableItems = JSON.parse(localStorage.getItem(tableNo));
    let totalactualPrice = 0;
    for (i = 0; i < tableItems.length; i++) {
      let tableItem = tableItems[i];
      let itemPrice = localStorage.getItem(tableItem);
      console.log("tableItem= " + tableItem);
      let newValue = localStorage.getItem(tableNo + "-" + tableItem + "-count");
      console.log(
        "itemsValue=" +
          localStorage.getItem(tableNo + "-" + tableItem + "-count") +
          "newValue =" +
          newValue
      );
      totalactualPrice = Number(totalactualPrice) + Number(itemPrice * newValue);
      console.log("totalactualPrice= " + totalactualPrice);
    }
    localStorage.setItem(tableNo + "-total-price", totalactualPrice);
  
    document.getElementById("total-price").innerHTML = totalactualPrice;
    let getIndex = tableNo.indexOf("-") + 1;
    document.getElementById(
      "total-price-" + tableNo.substring(getIndex)
    ).innerHTML = totalactualPrice;
  }
  
  window.onload = updateData();
  
  let bill = document.getElementById("bill");
  
  bill.addEventListener("click", function (event) {
    let tableOrder = event.target.parentNode.parentNode.id;
    console.log(tableOrder);
    console.log(
      "bill table =" + document.getElementById("table-no").innerHTML.toLowerCase()
    );
    document.getElementById(tableOrder).style.opacity = 0;
    document.getElementById(tableOrder).style.visibility = "hidden";
    document.getElementById("check-out").style.opacity = 1;
    document.getElementById("check-out").style.visibility = "visible";
    let tableOrderName = document
      .getElementById("table-no")
      .innerHTML.toLowerCase();
    checkout_list(tableOrderName);
  });
  
  document
    .getElementById("close-button-checkout")
    .addEventListener("click", function () {
      document.getElementById("check-out").style.opacity = 0;
      document.getElementById("container").style.opacity = 1;
      document.getElementById(tableName.toLowerCase()).style.backgroundColor =
        "white";
      console.log("closecheckout table= " + tableName);
      var arrLS = []; // Array to hold the keys
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, 7) === tableName.toLowerCase()) {
          arrLS.push(localStorage.key(i));
        }
      }
      for (var i = 0; i < arrLS.length; i++) {
        localStorage.removeItem(arrLS[i]);
      }
      updateData();
    });
  
  function checkout_list(tableOrderName) {
    let tableItems = [];
    tableItems = JSON.parse(localStorage.getItem(tableOrderName));
    console.log("tableItems= " + tableItems);
    $("#check-out-orders").empty();
    let columns =
      "<tr style='height: 32px;'><th>S.No</th><th>Item</th><th>Price</th><th>Quantity</th>";
    $(columns).appendTo("#check-out-orders");
  
    let order = "";
    for (i = 0; i < tableItems.length; i++) {
      let price = localStorage.getItem(tableItems[i]);
      let itemsCounts = localStorage.getItem(
        tableOrderName + "-" + tableItems[i] + "-count"
      );
      order +=
        "<tr id='" +
        tableItems[i] +
        "'> <th style=' font-size: small; font-weight: 500; width:20%'>" +
        (i + 1) +
        "</th><th style='font-size: small; font-weight: 500; width:40%'>" +
        tableItems[i] +
        "</th><th style='font-weight: 500'; width:20%>" +
        price +
        "</th> <th style=' font-size: small; font-weight: 500; width:20%'>" +
        itemsCounts +
        "</th></tr>";
    }
    $(order).appendTo("#check-out-orders");
    let newtotalPrice =
      "<tr><th></th><th></th><th style='font-size: small; font-weight: 500 '>Total-Price= <span id='checkout-total-price'>0.00</span></th></tr>";
    $(newtotalPrice).appendTo("#check-out-orders");
    let totalactualPrice = localStorage.getItem(tableOrderName + "-total-price");
  
    document.getElementById("checkout-total-price").innerHTML = totalactualPrice;
  }
  