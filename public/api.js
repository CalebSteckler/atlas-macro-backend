const getReportById = () => {
    const reportId = document.getElementById("report-id").value;
    console.log(reportId);

    window.location.href = `https://atlas-macro-backend.onrender.com/api/reports/${reportId}`;
}