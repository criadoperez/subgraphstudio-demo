import fetch from 'node-fetch';

async function fetchGraphQLData() {
    const endpoint = 'https://api.studio.thegraph.com/query/56687/subgraph26/version/latest';
    const query = `query firstquery {
        transfers(first: 2, orderBy: blockNumber, orderDirection: desc, where: {value: "10000000"}) {
            blockTimestamp
            id
            from
            to
            value
        }
    }`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        return data.data.transfers;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return [];
    }
}

function generateMarkdownTable(data) {
    let markdown = `| BlockTimestamp | From | To | Value | ID |\n`;
    markdown += `| --- | --- | --- | --- | --- |\n`;

    data.forEach(({ blockTimestamp, from, to, value, id }) => {
        markdown += `| ${blockTimestamp} | ${from} | ${to} | ${value} | ${id} |\n`;
    });

    return markdown;
}

async function main() {
    const data = await fetchGraphQLData();
    if (data.length > 0) {
        const markdownTable = generateMarkdownTable(data);
        console.log(markdownTable);
    } else {
        console.log("No data to display.");
    }
}

main();
