import  DashboardMenu from "../components/DashboardMenu"
import {getSummary} from '../api'
import Chartist from 'chartist'

let summary = {}
const DashboardPage = {
  after_render:()=>{
    new Chartist.Line(
      '.ct-chart-line',
      {
        labels: summary.dailyOrders.map((x) => x._id),
        series: [summary.dailyOrders.map((x) => x.sales)],
      },
      {
        showArea: true,
      }
    );
  },
  render:async()=>{
    summary = await getSummary()
    return`
      <div class="dashboard">
        ${DashboardMenu.render({selected:'dashboard'})}
        <div class="dashboard-content">
          <h1>Dashboard</h1>
          <ul class="summary-items">
          <li>
            <div class="summary-title color1">
              <span><i class="fa fa-users"></i> Users</span>
            </div>
            <div class="summary-body">${summary.users[0].numUsers}</div>
          </li>
          <li>
            <div class="summary-title color2">
              <span><i class="fa fa-users"></i> Orders</span>
            </div>
            <div class="summary-body">${summary.orders[0].numOrders}</div>
          </li>
          <li>
            <div class="summary-title color3">
              <span><i class="fa fa-users"></i> Sales</span>
            </div>
            <div class="summary-body">${summary.orders[0].totalSales} E</div>
          </li>
        </ul>
        <div class="chart">
          <h2>Sales</h2>
          <div class="ct-perfect-fourth ct-chart-line"></div>
      </div>
        </div>
      </div>
    `
  }
}

export default DashboardPage