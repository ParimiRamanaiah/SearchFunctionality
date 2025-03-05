const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    
    this.on('users', async (req) => {
        const { searchValue } = req.data;
        const where = [];

        if (searchValue) {
            const wildcardSearchValue = `%${searchValue}%`;
            console.log(wildcardSearchValue,"wildCard");
            where.push(`userId LIKE '${wildcardSearchValue}'`);
            where.push(`firstName LIKE '${wildcardSearchValue}'`);
            where.push(`lastName LIKE '${wildcardSearchValue}'`);
            where.push(`emailId LIKE '${wildcardSearchValue}'`);
        }

        if (where.length > 0) {
            const query = SELECT.from('User').where(where.join(' OR '));
            const result = await cds.run(query);
            // console.log("Data returned:", result);
            return result;
        }
    });
});


// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function () {
    
//     this.on('users', async (req) => {

//         const { searchValue } = req.data;
//         console.log(searchValue);
//         const where = [];

//         if (searchValue) {
//             const searchTerms = searchValue.split(' ');

//             // Add individual search terms for userId, firstName, lastName, and emailId
//             searchTerms.forEach(term => {
//                 where.push(`userId LIKE '%${term}%'`);
//                 where.push(`LOWER(firstName) LIKE '%${term}%'`);
//                 where.push(`lastName LIKE '%${term}%'`);
//                 where.push(`emailId LIKE '%${term}%'`);
//             });

//             // Add combined search terms for firstName and lastName
//             if (searchTerms.length > 1) {
//                 const combinedSearch = searchTerms.join('%');
//                 where.push(`CONCAT(firstName, ' ', lastName) LIKE '%${combinedSearch}%'`);
//             }
//          }

//         if (searchValue !== '') {
//             const query = SELECT.from('User').where(where.join(' OR '));
//             const result = await cds.run(query);
//             return result;
//         }
//     });
// });
