const getReports = async () => {
    const url = "https://calebsteckler.github.io/csce242/project/project-part-5/reports.json";
    const response = await fetch(url);
    return response.json();
};

const showReports = async () => {
    const report = await getReports();
    console.log(report);    
    const reportDiv = document.getElementById("reports-list");

    report.forEach(
        (report) => {
            const section = document.createElement("section");
            reportDiv.append(section);
            section.classList.add("report-card");
            section.classList.add("one");

            const img = document.createElement("img");
            img.src = `project-part-4/images/report-icon.png`;
            console.log(report.img);
            section.prepend(img);
            img.classList.add("report-icon");

            const h2 = document.createElement("h2");
            h2.innerHTML = report.title;
            section.append(h2);
            h2.classList.add("report-title");

            const p = document.createElement("p");
            p.innerHTML = report.author;
            section.append(p);
            p.classList.add("report-description");

            const button = document.createElement("button");
            button.innerHTML = "Read Report";
            section.append(button);
            button.classList.add("btn-read-report");
        }
    );
};

showReports();