'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    dis:async function  dis(ctx){
        const relatedActivities = await strapi.query('activity-logs').find({ _limit: '-1' })
        const userAgent = relatedActivities.map(item => item["userAgent"]);
        const ipAddress = relatedActivities.map(item => item["ipAddress"]);
        let unique=[];
        for(let i=0;i<ipAddress.length;i++){let prop = {
            'ipAddress': ipAddress[i],
            'userAgent': userAgent[i],
            
        }
        const x = unique.push(prop)}
        var resArr = [];
        unique.filter(function(item){
          var i = resArr.findIndex(x => (x.ipAddress == item.ipAddress && x.userAgent== item.userAgent ));
          if(i <= -1){
                resArr.push(item);
          }
        });
        return (resArr);
           
       },
    // localhost:3000?ipAddress=123.12.13.5
    // import {useLocation} from 'react-router-dom;
    // const location = useLocation();
    // const urlSearchParams = new URLSearchParams(location.search);
    //const ip = urlSearchParams.ipAddress
    // axios.get(`http://Localhost:1337/activity-logs/report/${ip}`)
   

    generateReport: async function generateReport(ctx) {

        function intersection(tab) {
            let i = 0;
            do {
                if (tab[i + 1].start >= tab[i].start && tab[i + 1].start < tab[i].end) {
                    let div1 = {
                        'start': tab[i].start,
                        'end': tab[i + 1].start,
                        'delay': tab[i].delay
                    }
                    let div2 = {
                        'start': tab[i + 1].start,
                        'end': tab[i].end,
                        'delay': tab[i].delay + tab[i + 1].delay
                    }
                    let div3 = {
                        'start': tab[i].end,
                        'end': tab[i + 1].end,
                        'delay': tab[i + 1].delay
                    }
                    let x1 = tab.push(div1);
                    x1 = tab.push(div2);
                    x1 = tab.push(div3);

                    let deletedElemnt = tab.splice(i + 1, 1);
                    deletedElemnt = tab.splice(i, 1);
                    break;
                }
                i++;

            } while (i + 1 < tab.length)

        }
        function checkIntersection(tab) {
            let intersect = false;
            let i = 0;
            do {
                if (tab[i + 1].start >= tab[i].start && tab[i + 1].start < tab[i].end) {
                    intersect = true;
                    break;
                }
                i++;
            } while (i + 1 < tab.length)

            return intersect;
        }
        function cleanTab(tab) {
            for (let i = 0; i < tab.length; i++) {
                if (tab[i].start == tab[i].end) {
                    let deletedElemnt = tab.splice(i, 1);

                }
            }
        }
        function checkRedundancies(tab) {
            for (let i = 0; i < tab.length; i++) {
                for (let j = 0; j < tab.length; j++) {
                    if (i != j && tab[i].start == tab[j].start && tab[i].end == tab[j].end) {
                        let div = {
                            'start': tab[i].start,
                            'end': tab[i].end,
                            'delay': tab[i].delay + tab[j].delay
                        }
                        const addDiv = tab.push(div);
                        let deletedElemnt = tab.splice(i, 1);
                        deletedElemnt = tab.splice(j, 1);
                    }
                }
            }
        }
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        function generateColors(tab) {
            let b = 235;
            let r = 0;
            let g = 235;
            while (b > 6) {
                let color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                const addColor = tab.push(rgbToHex(r, g, b));
                // const addColor =tab.push([r, g, b]);
                b = b - 7;
            }
            while (r < 235) {
                let color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                const addColor = tab.push(rgbToHex(r, g, b));
                // const addColor =tab.push([r, g, b]);
                r = r + 7;
            }
            while (g > 6) {
                let color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                const addColor = tab.push(rgbToHex(r, g, b));
                // const addColor =tab.push([r, g, b]);
                g = g - 7;
            }
        }
        const { ipAddress } = ctx.params
        let colors = [];
        const divLength = 800;
        const relatedActivities = await strapi.query('activity-logs').find({ _limit: '-1', ipAddress })
        const report = {
            all: relatedActivities,
            count: relatedActivities.length
        }
        const delais = relatedActivities.map(item => Number(item.delay));
        const positions = relatedActivities.map(item => Number(item.currentPoint));

        let divTab = [];
        generateColors(colors);
        for (let i = 0; i < positions.length; i++) {
            let prop = {
                'start': positions[i],
                'end': positions[i] + divLength,
                'delay': delais[i]
            }
            const x = divTab.push(prop)
        }
        // let prop = {
        //     'start': 850,
        //     'end': 850 + divLength,
        //     'delay': 80
        // }
        // const x = divTab.push(prop)
        divTab = divTab.sort(((c1, c2) => (c1.start > c2.start) ? 1 : (c1.start < c2.start) ? -1 : 0));

        checkRedundancies(divTab);
       
        while (checkIntersection(divTab)) {
            intersection(divTab);
            divTab = divTab.sort(((c1, c2) => (c1.start > c2.start) ? 1 : (c1.start < c2.start) ? -1 : 0));
        checkRedundancies(divTab);}
      
        
        
        cleanTab(divTab);
        divTab = divTab.sort(((c1, c2) => (c1.start > c2.start) ? 1 : (c1.start < c2.start) ? -1 : 0));
        let max = Math.max.apply(Math, divTab.map(function (o) { return o.delay; }))
        console.log(max);
        divTab.forEach(div => {
            div['color'] = colors[Math.round((div.delay * 100) / max) - 1];
            div['percentage'] = Math.round((div.delay * 100) / max)
        });

        console.log(colors);
        return (divTab)
    }
};


