async function sendCurrentURL() {
    let url = window.location.href;
    let videoId = new URL(url).searchParams.get("v");

    if (!videoId) {
        console.error("Could not extract video ID");
        return;
    }

    console.log("Sending video ID:", videoId);

    try {
        let response = await fetch("http://127.0.0.1:8080/toxic_comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId: videoId }),
            mode: "cors"
        });

        if (!response.ok) {
            console.error("Failed to fetch toxic comments");
            return;
        }

        const data = await response.json();
        console.log("Toxic comments received:", data);
        updateSidebar(data.toxic_comments, data.toxic_count, data.nontoxic_count); 
    } catch (error) {
        console.error("Error in fetching toxic comments:", error);
    }
}

function updateSidebar(toxicComments, toxicCount, nontoxicCount) {
    document.body.style.width = "50vw"; 
    document.body.style.float = "left"; 

    let existingSidebar = document.getElementById("toxic-sidebar");
    if (existingSidebar) existingSidebar.remove();

    let sidebar = document.createElement("div");
    sidebar.id = "toxic-sidebar";
    sidebar.style.position = "fixed";
    sidebar.style.right = "0";
    sidebar.style.width = "35vw";
    sidebar.style.height = "100vh";
    sidebar.style.background = "white";
    sidebar.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    sidebar.style.padding = "10px";
    sidebar.style.overflowY = "scroll";
    sidebar.style.zIndex = "9999";
    sidebar.style.fontSize = "12px";

    let title = document.createElement("h3");
    title.textContent = "Toxic Comments";
    sidebar.appendChild(title);

   
    let toxicList = document.createElement("table");
    toxicList.style.width = "100%";
    toxicList.style.borderCollapse = "collapse";

    let headerRow = document.createElement("tr");
    ["Author", "Comment", "Likes", "Updated At", "Prediction"].forEach(text => {
        let th = document.createElement("th");
        th.textContent = text;
        th.style.border = "1px solid black";
        th.style.padding = "5px";
        th.style.backgroundColor = "black";
        th.style.color = "white";
        headerRow.appendChild(th);
    });
    toxicList.appendChild(headerRow);

    toxicComments.forEach(comment => {
        let row = document.createElement("tr");

        ["author", "text", "likes", "updated_at", "prediction"].forEach(key => {
            let cell = document.createElement("td");
            cell.textContent = key === "prediction" ? JSON.stringify(comment[key]) : comment[key];
            cell.style.border = "1px solid black";
            cell.style.padding = "5px";
            cell.style.whiteSpace = "nowrap";
            row.appendChild(cell);
        });

        toxicList.appendChild(row);
    });

    sidebar.appendChild(toxicList);
    document.body.appendChild(sidebar);

    // Initialize Pie Chart
    createPieChart(toxicCount, nontoxicCount);
}

function createPieChart(toxicCount, nonToxicCount) {
    let canvas = document.createElement("canvas");
    canvas.id = "toxicityChart";
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.cursor = "pointer";

    let chartContainer = document.createElement("div");
    chartContainer.style.marginTop = "20px";
    chartContainer.style.textAlign = "center";

    let chartTitle = document.createElement("h3");
    chartTitle.textContent = "Toxic vs Non-Toxic Comments";
    chartContainer.appendChild(chartTitle);
    chartContainer.appendChild(canvas);

    let sidebar = document.getElementById("toxic-sidebar");
    sidebar.insertBefore(chartContainer, sidebar.firstChild); // Insert chart before the table

    let ctx = canvas.getContext("2d");
    let total = toxicCount + nonToxicCount;
    let colors = ["#FF6384", "#36A2EB"];
    let hoverColors = ["#FF2050", "#1E90FF"]; // Lighter shades on hover
    let labels = ["Toxic", "Non-Toxic"];
    let values = [toxicCount, nonToxicCount];

    let startAngle = 0;
    let segments = [];

    function drawChart(highlightedSegment = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startAngle = 0;

        for (let i = 0; i < values.length; i++) {
            let sliceAngle = (values[i] / total) * 2 * Math.PI;
            let endAngle = startAngle + sliceAngle;

            let isHighlighted = highlightedSegment === i;
            let fillColor = isHighlighted ? hoverColors[i] : colors[i];

            segments[i] = { start: startAngle, end: endAngle, index: i };

            // Draw Pie Slice
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, isHighlighted ? 110 : 100, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Calculate Text Position for Values
            let midAngle = startAngle + sliceAngle / 2;
            let textX = 150 + Math.cos(midAngle) * 60; // Move towards center
            let textY = 150 + Math.sin(midAngle) * 60;

            ctx.fillStyle = "#fff"; // White text for contrast
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(values[i], textX, textY);

            startAngle = endAngle;
        }
    }

    drawChart(); // Initial chart draw

    // Hover Interaction
    canvas.addEventListener("mousemove", function (event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 150;
        let y = event.clientY - rect.top - 150;
        let angle = Math.atan2(y, x);
        if (angle < 0) angle += 2 * Math.PI;

        let hoveredSegment = segments.find(segment => angle >= segment.start && angle <= segment.end);
        if (hoveredSegment) {
            canvas.style.cursor = "pointer";
            drawChart(hoveredSegment.index); // Highlight hovered segment
            showTooltip(event, `${labels[hoveredSegment.index]}: ${values[hoveredSegment.index]}`);
        } else {
            canvas.style.cursor = "default";
            drawChart(); // Remove highlight
            hideTooltip();
        }
    });

    function showTooltip(event, text) {
        let tooltip = document.getElementById("pie-tooltip");
        if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.id = "pie-tooltip";
            tooltip.style.position = "fixed";
            tooltip.style.padding = "5px 10px";
            tooltip.style.background = "rgba(0,0,0,0.7)";
            tooltip.style.color = "white";
            tooltip.style.borderRadius = "5px";
            tooltip.style.fontSize = "12px";
            tooltip.style.pointerEvents = "none";
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
        tooltip.style.display = "block";
    }

    function hideTooltip() {
        let tooltip = document.getElementById("pie-tooltip");
        if (tooltip) tooltip.style.display = "none";
    }
}

sendCurrentURL();
