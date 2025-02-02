document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("Token");
    window.location.href = "index.html"
})

document.addEventListener("DOMContentLoaded", () => {
    getData()
})

let xps;
let alltries;

async function getData(){
    const token = localStorage.getItem("Token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const resp = await fetch("https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                    {
                      user{
                        id
                        firstName
                        login
                        lastName
                        auditRatio
                        transactions(where: {type:{ _eq: "xp"}}){
                          amount
                          path
                          createdAt
                        }
                        results(where: {type:{ _eq: "tester"}}){
                          id
                          path
                        }
                      }
                    }
                    `
            })
        });
        const data = await resp.json();
        xps = data.data.user[0].transactions;

        const Reg = /module(?!\/piscine)/i;
        const total = xps
          .filter(xp => Reg.test(xp.path))
          .reduce((sum, xp) => sum + xp.amount, 0);
        const KbXp = ((total + 70000) / 1000).toFixed(0);

        let am = 'KB';
        if (KbXp >= 1000) {
            KbXp = (KbXp / 1000).toFixed(2);
            am = 'MB'
        }
        document.querySelector("#username").textContent = `${data.data.user[0].login}`;
        document.querySelector("#audit-data").textContent = `${(data.data.user[0].auditRatio).toFixed(1)}`;
        document.querySelector("#idbox").textContent = `${data.data.user[0].firstName + ' ' + data.data.user[0].lastName + ' - ' + data.data.user[0].id}`;
        document.querySelector("#xp-data").innerHTML = `${KbXp+' '+am}`;

        const count = {}; 
        data.data.user[0].results.forEach(exercise => {
            const match = exercise.path.match(/2024-(.*)/);
            let name;
        
            if (match) {
                name = match[1];
            } else {
                name = exercise.path.split("/").pop();
            }
        
            if (count[name] === undefined) {
                count[name] = 1;
            } else {
                count[name] += 1;
            }
        });

     alltries = Object.entries(count)
    .map(([name, tries]) => ({ name, tries }))
    .sort((a, b) => b.tries - a.tries)
    .slice(0, 10);

    renderXpChart(xps);
    renderTryChart(alltries);
    let top3 = await getSkills(token);
    const skilltxt = top3.map(skill => `${skill.skill}: ${skill.totalAmount}`).join(" | ");
    document.querySelector("#skills-data").innerHTML = `${skilltxt}`
    } catch (error) {
        console.error(error);
    }
}

async function getSkills(token) {
    const resp = await fetch("https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
      transaction(
        where: {
          type: { _ilike: "%skill%" }
        }
      ) {
        type
        amount
      }
    }`,
      }),
    })
    const data = await resp.json();
    const transactions = data.data.transaction;
  
    const skillstotal = transactions.reduce((counter, transaction) => {
      const skill = transaction.type;
      if (counter[skill]) {
        counter[skill] += transaction.amount;
      } else {
        counter[skill] = transaction.amount;
      }
      return counter;
    }, {});
  

    const topSkills = Object.entries(skillstotal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill, totalAmount]) => ({
        skill: skill.replace(/^skill_/, ""),
        totalAmount,
      }));

    return topSkills;
  }