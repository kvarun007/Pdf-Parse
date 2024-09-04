const pdfParse = require('./pdfParse'); // Correctly import the module
const fs = require('fs');

const filePath_1 = process.argv[2];
const filePath_2 = process.argv[3];

// Validate both file paths
if (!filePath_1 || !filePath_2) {
    console.error('Both file paths must be provided');
    process.exit(1); // Exit if not enough arguments are provided
}

// Function to parse and log data for a file
const parseAndLog = async (filePath) => {
    try {
        const parsedData = await pdfParse(filePath);
        console.log(`Parsed data for ${filePath}:`);
        return parsedData;
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
        return null; // Return null in case of error
    }
};

// Function to handle processing both files
const processFiles = async () => {
    const purchases = await parseAndLog(filePath_1);
    const payments = await parseAndLog(filePath_2);

    console.log('Purchases:',purchases);
    console.log('Payments:', payments);

    purchases[0].push("ref number");
    purchases[0].push("status");
    purchases[0].push("payemnt dates");


    let rn = payments[1][1];
    let currBal = Number(payments[1][2]) ;
    let paymentDate = payments[1][0];
    let temp = 2;
    let loop = 1

    for(let i=1; i<purchases.length; i++){
        // console.log(i)
        console.log( "present invoice - " + purchases[i][2]);
        console.log(typeof(purchases[i][2]))
        if(Number(purchases[i][2]) == currBal){
            purchases[i].push(rn);
            purchases[i].push("settled");
            purchases[i].push(paymentDate);
            if(temp < payments.length){
                rn = payments[temp][1];
                currBal = Number(payments[temp][2]) ;
                paymentDate = payments[temp][0] ;
                temp++
            }else{
                break;
            }
            
        }
        else if(Number(purchases[i][2]) < currBal){
            console.log("<")
            purchases[i].push(rn);
            purchases[i].push("settled");
            purchases[i].push(paymentDate);

            currBal = currBal - Number(purchases[i][2])
            
            if(rn.split("/").length > 1){
                let spendAmount = Number(purchases[i][2]);
                let indexToRemove = 0
                console.log( "dfsssssssssssssdfdddddddddddddd"+rn.split("/").length)
                while(spendAmount >0 && loop < payments.length){
                    // console.log("looppppp is runinning" )
                    console.log(`spendAmount: ${spendAmount}, loop: ${loop}, indexToRemove: ${indexToRemove}`);
                    spendAmount = spendAmount - Number(payments[loop][2]);
                    indexToRemove ++
                    loop++
                }
                loop--
                rn = rn.split("/").splice(1,indexToRemove-1).join("/");
                paymentDate = paymentDate.split("/").splice(1,indexToRemove-1).join("/")
            }
            
            
            // console.log("AMOUNT -" + spendAmount+","+ "index -" + indexToRemove+"," +"loop -"+ loop)
            // console.log(rn.split("/"))
            // console.log(rn.split("/").splice(0,indexToRemove-1).join("/"))
            
            // console.log(rn)
            
        }
        else{
            // console.log(temp)
            if(temp < payments.length){
                rn = rn + "/" + payments[temp][1] ;
                currBal = currBal + Number(payments[temp][2]) ;
                paymentDate = paymentDate + "/" + payments[temp][0];
                temp++;
                i--;
            }else{
                purchases[i].push("no ref num")
                purchases[i].push("not settled")
                purchases[i].push("no date")
                // console.log("loop breaked")
                // break;
            }
            
        }
        // console.log(i)
        // console.log("ren - " + rn);
        // console.log("currBal - " +currBal);
        // console.log("currBal - " +typeof(currBal));
        // console.log("paymentDate - " +paymentDate);
        // console.log("temp - " + temp)
    }
    console.log('Updated Purchases:', purchases)

    const convertToCsv = (data) => {
        // Create the CSV header
        // const header = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7'];
        const csvRows = [];
    
        // Convert each row of data to CSV format
        data.forEach(row => {
            csvRows.push(row.map(field => `"${field}"`).join(','));
        });
    
        return csvRows.join('\n');
    };
    
    // Function to write CSV string to file
    const writeToCsv = (csvString, filePath) => {
        fs.writeFile(filePath, csvString, (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
            } else {
                console.log(`CSV file was written successfully to ${filePath}`);
            }
        });
    };

    const csvString = convertToCsv(purchases);
    writeToCsv(csvString, "./Excel/updated_purchases.csv");
};

// Execute the processing function
processFiles();
