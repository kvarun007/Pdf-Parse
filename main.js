const pdfParse = require('./pdfParse'); // Correctly import the module

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

    let rn = payments[1][1];
    let currBal = Number(payments[1][2]) ;
    let paymentDate = payments[1][0];
    let temp = 2;

    for(let i=1; i<purchases.length; i++){
        console.log(i)
        console.log( "present invoice - " + purchases[i][2]);
        console.log(typeof(purchases[i][2]))
        if(Number(purchases[i][2]) == currBal){
            purchases[i].push(rn);
            purchases[i].push("settled");
            purchases[i].push(paymentDate);

            rn = payments[temp][1];
            currBal = Number(payments[temp][2]) ;
            paymentDate = payments[temp][0] ;
            temp++
        }
        else if(Number(purchases[i][2]) < currBal){
            console.log("<")
            purchases[i].push(rn);
            purchases[i].push("settled");
            purchases[i].push(paymentDate);

            currBal = currBal - Number(purchases[i][2])
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
                console.log("loop breaked")
                break;
            }
            
        }
        // console.log(i)
        console.log("ren - " + rn);
        console.log("currBal - " +currBal);
        console.log("currBal - " +typeof(currBal));
        console.log("paymentDate - " +paymentDate);
        console.log("temp - " + temp)
    }
    console.log('Updated Purchases:', purchases)
};

// Execute the processing function
processFiles();
