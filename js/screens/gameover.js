game.GameOverScreen = me.ScreenObject.extend({

    var questions = new Array(10);
    questions[0]= "Diabetes causes more deaths a year than breast cancer and AIDS combined";
    questions[1]= "Having diabetes nearly doubles your chance of having a heart attack"; 
    questions[2]= "Being overweight or ​ obese raises the risk of becoming diabetic";
    questions[3]= "A person with diabetes ​type 1 developed the disease because their 
            immune system destroyed the insulin­producing beta cells";
    questions[4]=  "Drinking sugary drinks is linked to type 2 diabetes"; 
    questions[5]= "Diabetes can often be detected by carrying out a urine test";
    questions[6]= "Type 1 diabetes usually first appears in childhood or adolescence.";
    questions[7]= " Frequent urination is on the Symptoms of diabetes ";
    questions[8]= "One person can transmit diabetes to another person";
    questions[9]= "People with diabetes should not exercise";


    var i = 0;

    // var questions = 
    //         {"id": "1","information": },
    //         {"id": "2","information": }
    //         {"id": "3","information": "Being overweight or ​ obese raises the risk of becoming diabetic"},
    //         {"id": "4","information": "A person with diabetes ​type 1 developed the disease because their immune system destroyed the insulin­producing beta cells"},
    //         {"id": "5","information": "Drinking sugary drinks is linked to type 2 diabetes"},
    //         {"id": "6","information": "Diabetes can often be detected by carrying out a urine test"},
    //         {"id": "7","information": "Type 1 diabetes usually first appears in childhood or adolescence."},
    //         {"id": "8","information": " Frequent urination is on the Symptoms of diabetes "},
    //         {"id": "9","information": "One person can transmit diabetes to another person"},
    //         {"id": "10","information": "People with diabetes should not exercise"};
    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function() {
        //save section
        this.savedData = {
            score: game.data.score,
            steps: game.data.steps
        };
        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN,
            function (action, keyCode, edge) {
                if (action === "enter") {
                    me.state.change(me.state.MENU);
                }
            });

        me.game.world.addChild(new me.Sprite(
            (me.game.viewport.width/2)+100,
            (me.game.viewport.height/2 - 100)+100,
            {image: 'gameover'}
        ), 12);

        var gameOverBG = new me.Sprite(
            (me.game.viewport.width/2)+100,
            (me.game.viewport.height/2)+100,
            {image: 'gameoverbg'}
        );
        me.game.world.addChild(gameOverBG, 10);

        me.game.world.addChild(new BackgroundLayer('bg', 1));

        // ground
        this.ground1 = me.pool.pull('ground', 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull('ground', me.game.viewport.width,
            me.video.renderer.getHeight() - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        // add the dialog witht he game information
        if (game.data.newHiScore) {
            var newRect = new me.Sprite(
                gameOverBG.width/2,
                gameOverBG.height/2,
                {image: 'new'}
            );
            me.game.world.addChild(newRect, 12);
        }

        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {

                this._super(me.Renderable, 'init',
                    [0, 0, me.game.viewport.width/2, me.game.viewport.height/2]
                );
                this.font = new me.Font('gamefont', 40, 'black', 'left');
                // this.steps = game.data.questions[0];
                this.steps = "Being overweight or ​obese raises the risk of becoming diabetic";
                this.topSteps= 'Higher Step: ' + me.save.topSteps.toString();
            },

            draw: function (renderer) {
                var stepsText = this.font.measureText(renderer, this.steps);
            //     var topStepsText = this.font.measureText(renderer, this.topSteps);
            //     var scoreText = this.font.measureText(renderer, this.score);

                //steps
                this.font.draw(
                    renderer,
                    this.steps,
                    me.game.viewport.width/2 - stepsText.width/2 - 60,
                    me.game.viewport.height/2
                );

            //     //top score
            //     this.font.draw(
            //         renderer,
            //         this.topSteps,
            //         me.game.viewport.width/2 - stepsText.width/2 - 60,
            //         me.game.viewport.height/2 + 50
            //     );
            }
        }));
        me.game.world.addChild(this.dialog, 12);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        this.font = null;
        me.audio.stop("theme");
    }
});
