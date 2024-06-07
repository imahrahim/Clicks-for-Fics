export function backgroundGenerator(ratings) {
    return function(p) {
        p.setup = function() {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.noLoop();  
        };

        p.draw = function() {
            p.clear();
            drawGradientBackground();
        };

        function drawGradientBackground() {
            let totalFrequency = ratings.reduce((sum, rating) => sum + rating.frequency, 0);
            let yOffset = 0;

            for (let i = 0; i < ratings.length; i++) {
                let rating = ratings[i];
                let nextRating = ratings[i + 1] || ratings[i];
                let frequencyRatio = rating.frequency / totalFrequency;
                let nextFrequencyRatio = nextRating.frequency / totalFrequency;

                let yHeight = frequencyRatio * p.height;
                let nextYHeight = nextFrequencyRatio * p.height;

                for (let y = yOffset; y < yOffset + yHeight; y++) {
                    let inter = p.map(y, yOffset, yOffset + yHeight, 0, 1);
                    let c = p.lerpColor(p.color(rating.color), p.color(nextRating.color), inter);
                    p.stroke(c);
                    p.line(0, y, p.width, y);
                }
                yOffset += yHeight;
            }
        }
    };
}
