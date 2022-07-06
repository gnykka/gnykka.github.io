(() => {
  window.addEventListener('load', () => {
    const renderCategoriesChart = (data) => {
      const width = 400;
      const height = 250;
      const margin = { top: 20, right: 25, bottom: 150, left: 50 };

      const svg = d3.select('svg#categories')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const lengths = [10, 15, 30, 60];
      const categories = data.reduce((res, d) => {
        res[d.category] = res[d.category] || { total: 0 };
        res[d.category][d.length] = res[d.category][d.length] ? res[d.category][d.length] + 1 : 1;
        res[d.category].total += 1;
        return res;
      }, {});

      const xScale = d3.scaleBand()
        .domain(Object.keys(categories).sort((a, b) => categories[a].total - categories[b].total))
        .range([0, width])
        .padding(0.1);

      const color = d3.scaleOrdinal()
        .range(d3.schemeTableau10)
        .domain(lengths);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(categories).map(v => v.total))])
        .range([height, 0]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-65)');

      svg.append('g')
        .call(d3.axisLeft(yScale));

      svg.selectAll('rect')
        .data(Object.keys(categories))
        .enter()
        .append('rect')
        .attr('x', d => xScale(d))
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(categories[d].total))
        .attr('height', d => height - yScale(categories[d].total))
        .attr('fill', d3.schemeTableau10[0]);
    };

    const renderCountsChart = (data, param) => {
      const width = 600;
      const height = 200;
      const margin = { top: 20, right: 25, bottom: 80, left: 50 };

      const svg = d3.select(`svg#${param}s`)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d[param])])
          .range([0, width]);

      const histogram = d3.histogram()
          .value(d => d[param])
          .domain(xScale.domain())
          .thresholds(xScale.ticks(50));
      const bins = histogram(data);

      const yScale = d3.scaleLinear()
          .domain([0, d3.max(bins, d => d.length)])
          .range([height, 0]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .call(d3.axisLeft(yScale));

      svg.selectAll('rect')
          .data(bins)
          .enter()
          .append('rect')
            .attr('x', 1)
            .attr('transform', d => `translate(${xScale(d.x0)},${yScale(d.length)})`)
            .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr('height', d => height - yScale(d.length))
            .style('fill', d3.schemeTableau10[0]);
    };

    const renderCorrelationChart = (data) => {
      const width = 400;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 120, left: 50 };

      const svg = d3.select(`svg#correlation`)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const div = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('padding', '4px 8px')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px');

      const categories = Object.keys(
        data.reduce((res, d) => {
          res[d.category] = res[d.category] ? res[d.category] + 1 : 1;
          return res;
        }, {})
      );
      const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(categories);

      console.log(colorScale.domain(), colorScale.range());

      const xScale = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.count)])
          .range([0, width]);

      const yScale = d3.scaleLinear()
          .domain([d3.max(data, d => d.time), 0])
          .range([0, width]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .call(d3.axisLeft(yScale));

      svg.selectAll('cirle')
          .data(data)
          .enter()
          .append('circle')
            .attr('cx', d => xScale(d.count))
            .attr('cy', d => yScale(d.time))
            .attr('r', 5)
            .attr('title', d => d.title)
            .style('stroke', d => colorScale(d.category))
            .style('fill', d => {
              const color = d3.hsl(colorScale(d.category));
              color.opacity = 0.5;
              return color + '';
            })
          .on('mouseover', (event, d) => {
             div.transition().duration(100).style('opacity', 0.9);
             div
               .html(`${d.title}, ${d.category}, ${d.language}, ${d.length}`)
               .style('left', (event.pageX + 10) + 'px')
               .style('top', (event.pageY - 30) + 'px');
             })
          .on('mouseout', () => {
            div.transition().duration(100).style('opacity', 0);
          });
    };

    d3
      .csv('../data/holyjs.csv', data => ({
        dateTime: data.Date,
        date: new Date(data.Date),
        title: data.Title,
        language: data.Lang,
        category: data.Category,
        length: parseInt(data.Length),
        count: parseInt(data.Count),
        time: data.Length ? parseInt(data.MeanTime) / parseInt(data.Length) : 0,
      }))
      .then(data => {
        data = data.filter(d => d.length);

        renderCategoriesChart(data);
        renderCountsChart(data, 'count');
        renderCountsChart(data, 'time');
        renderCorrelationChart(data);
      });
  });
})();
