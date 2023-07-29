const fs = require('fs');

// Function pour choper les volumes en ETH totaux, achats, ventes + le nombre de txns
function calculs(database) {
  let totalETH = 0;
  let totalAchats = 0;
  let totalVentes = 0;
  let nbTx =0;
  for (const sublist of database) {
    if (sublist.length >= 5) {
      totalETH += sublist[5];
    }
    if (sublist[3]==="achat" ) {
      totalAchats +=sublist[5];
    }
    if (sublist[3]==="vente" ) {
      totalVentes +=sublist[5];
    }
    nbTx+=1;
  }
  return [totalETH,totalAchats,totalVentes,nbTx];
}

// Function pour choper les volumes en ETH totaux, achats, ventes + le nombre de txns pour une adresse donnée
function calculsParAddress(database,address) {
  let totalETH = 0;
  let totalAchats = 0;
  let totalVentes = 0;
  let nbTx =0;
  for (const sublist of database) {
    const sublistAddress = sublist[1]; // Address is the 2nd element of the sublist
    if (sublistAddress === address) {
      if (sublist.length >= 5) {
        totalETH += sublist[5];
      }
      if (sublist[3]==="achat" ) {
        totalAchats +=sublist[5];
      }
      if (sublist[3]==="vente" ) {
        totalVentes +=sublist[5];
      }
      nbTx+=1;
    }
  }
  return [totalETH,totalAchats,totalVentes,nbTx];
}


// Function to convert integer date to "YYYY-MM-DD" format
function formatDate(dateInt) {
  const date = new Date(dateInt * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function pour calculs total volume, achats ventes et nb tx, pour chaque jour
function calculsPerDay(database) {
  const totalETHPerDay = {};
  const achatsPerDay = {};
  const ventesPerDay = {};
  const nbTx = {};
  for (const sublist of database) {
    if (sublist.length >= 6) {
      const dateKey = formatDate(sublist[2]); 
      totalETHPerDay[dateKey] = (totalETHPerDay[dateKey] || 0) + sublist[5];
      if (sublist[3]==="achat"){
        achatsPerDay[dateKey] = (achatsPerDay[dateKey] || 0) + sublist[5];
      }
      if (sublist[3]==="vente"){
        ventesPerDay[dateKey] = (ventesPerDay[dateKey] || 0) + sublist[5];
      }
      nbTx[dateKey] = (nbTx[dateKey] || 0) + 1;
    }
  }
  return [totalETHPerDay,achatsPerDay,ventesPerDay, nbTx];
}

// Function pour calculs total volume, achats ventes et nb tx, pour chaque jour pour une adresse
function calculsPerDayPerAddress(database,address) {
  const totalETHPerDay = {};
  const achatsPerDay = {};
  const ventesPerDay = {};
  const nbTx = {};
  for (const sublist of database) {
    if (sublist.length >= 6) {
      if (sublist[1] === address) {
        const dateKey = formatDate(sublist[2]); 
        totalETHPerDay[dateKey] = (totalETHPerDay[dateKey] || 0) + sublist[5];
        if (sublist[3]==="achat"){
          achatsPerDay[dateKey] = (achatsPerDay[dateKey] || 0) + sublist[5];
        }
        if (sublist[3]==="vente"){
          ventesPerDay[dateKey] = (ventesPerDay[dateKey] || 0) + sublist[5];
        }
        nbTx[dateKey] = (nbTx[dateKey] || 0) + 1;
      }
    }
  }
  return [totalETHPerDay,achatsPerDay,ventesPerDay, nbTx];
}

// Fonction qui renvoie un dictionnaire avec le volume tradé pour chaque token (pour une adresse donnée)
function favoriteToken(database, address) {
  const occurrences = {};
  for (const sublist of database) {
    const sublistAddress = sublist[1]; // Address is the 2nd element of the sublist
    if (sublistAddress === address) {
      const tokenName = sublist[4]; //nom du token
      occurrences[tokenName] = (occurrences[tokenName] || 0) + 1;
    }
  }
  return occurrences;
}

// Fonction qui renvoie un dictionnaire avec le profit pour chaque token (pour une adresse donnée)
function profitParToken(database, address) {
  const achatsToken = {};
  const ventesToken = {};
  for (const sublist of database) {
    const sublistAddress = sublist[1]; // Address is the 2nd element of the sublist
    if (sublistAddress === address) {
      const tokenName = sublist[4]; //nom du token
      if (sublist[3]=== "achat") {
        achatsToken[tokenName] = (achatsToken[tokenName] || 0) + sublist[5];
    }
      if (sublist[3]==="vente"){
        ventesToken[tokenName] = (ventesToken[tokenName] || 0) + sublist[5];
      }
    }
  }

  const tokensAchats = Object.keys(achatsToken);
  const tokensVentes = Object.keys(ventesToken);

  const commonTokens= tokensAchats.filter((key) => tokensVentes.includes(key))
  const profits = {};
  
  for (const token of commonTokens) {
    profits[token] = ventesToken[token] - achatsToken[token];
  }

  return [profits];
}


// Read the data from "listeInfos.txt"
fs.readFile('listeInfos.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Fix the single quotes to double quotes and parse the data into a JavaScript data structure (list of lists)
    const fixedData = data.replace(/'/g, '"');
    const database = JSON.parse(fixedData);

    // Calculs
    //const [totalETH, totalAchats, totalVentes, nbTx] = calculsParAddress(database,'0x758aDE6E2EB059Fb7cbE2502C8de376b4863EcC0');
    //console.log('Total volume 0x75...cC0 ETH', totalETH);
    //console.log('Total achats 0x75...cC0 ETH', totalAchats);
    //console.log('Total ventes 0x75...cC0 ETH', totalVentes);
    //console.log('Nombre total 0x75...cC0 txns', nbTx);
    //const addressOccurrences = favoriteToken(database, '0x758aDE6E2EB059Fb7cbE2502C8de376b4863EcC0');
    //console.log('Liste des shitcoins préférés de 0x75...cC0:', addressOccurrences);
    //const [tokens] = profitParToken(database,'0x758aDE6E2EB059Fb7cbE2502C8de376b4863EcC0');
    //console.log('Profit par token 0x75...cC0', tokens);
    const [totalPerDay,totalAch,totalVen, nbTx] = calculsPerDay(database);
    console.log('Daily volume', totalPerDay);
    console.log('Daily achats', totalAch);
    console.log('Daily ventes', totalVen);
    console.log('Daily nb txns', nbTx);
    //const [totalPerDay,totalAch,totalVen, nbTx] = calculsPerDayPerAddress(database,'0x758aDE6E2EB059Fb7cbE2502C8de376b4863EcC0');
    //console.log('Daily volume 0x75...cC0', totalPerDay);
    //console.log('Daily achats 0x75...cC0', totalAch);
    //console.log('Daily ventes 0x75...cC0', totalVen);
    //console.log('Daily nb txns 0x75...cC0', nbTx);
  
  
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});