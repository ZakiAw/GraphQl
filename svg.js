function renderXpChart(xps) {
xps.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

let totalXP = 0;
const xpData = xps.map(d => {
    totalXP += d.amount;
    return { 
        timestamp: new Date(d.createdAt), 
        totalXP: totalXP / 1000
    };
});

const labels = xpData.map(d => 
    new Intl.DateTimeFormat('en-GB').format(d.timestamp)
);
const dataPoints = xpData.map(d => d.totalXP);

const ctx = document.getElementById("xpChart").getContext("2d");
new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: labels,
            data: dataPoints,
            borderColor: "#c2ffbf",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 6,
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false },
                title: { display: false }
            },
            y: {
                beginAtZero: true,
                ticks: { color: "rgba(255, 255, 255, 0.6)" },
                grid: { color: "rgba(255, 255, 255, 0.1)" }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "XP Progress",
                color: "#ffffff",
                font: { size: 16 },
                padding: { top: 10 }
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                bodyColor: "#ffffff",
                intersect: false,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `XP: ${context.raw.toFixed(0)}`;
                    }
                }
            }
        }
    }
});
}


function renderTryChart(tri) {{
    const labels = tri.map(exercise => exercise.name);
    const tries = tri.map(exercise => exercise.tries);
    
    const ctx = document.getElementById("exerciseBarChart").getContext("2d");
    
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Tries",
          data: tries,
          backgroundColor: "rgba(167, 214, 165, 0.2)",
          borderColor: "#c2ffbf",
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            ticks: { color: "rgba(255, 255, 255, 0.6)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            beginAtZero: true
          },
          x: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          }
        },
        plugins: {
            title: {
              display: true,
              text: "Exercise Attempts",
              color: "#ffffff",
              font: { size: 16 },
              padding: { top: 10 }
            },
            legend: {
              display: false  
            },
            tooltip: {
              displayColors: false,
            }
          }
        }
      });
  }}