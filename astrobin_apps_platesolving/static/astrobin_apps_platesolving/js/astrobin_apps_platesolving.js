(function(win) {
    function Platesolving(config) {
        this.solveURL  = '/platesolving/solve/';
        this.statusURL = '/api/v2/platesolving/solutions/';
        this.updateURL = '/platesolving/update/';
        this.finalizeURL = '/platesolving/finalize/';

        this.$root = $('#platesolving-status');
        this.$content = this.$root.find('.progress-text');
        this.$progress = this.$root.find('.progress');
        this.$bar = this.$root.find('.bar');
        this.$icon = this.$root.find('i');

        this.updateQueries = 0;

        $.extend(this, config);

        astrobin_common.init_ajax_csrf_token();
    }

    Platesolving.prototype = {
        process: function() {
            if (this.solution === 0) {
                /* The platesolving has never been attempted on this resource. */
                this.solve();
            } else {
                this.getStatus();
            }
        },

        solve: function() {
            var self = this;

            self.onStarting();

            $.ajax({
                url: this.solveURL + this.image + '/',
                type: 'post',
                timeout: 30000,
                success: function(data, textStatus, jqXHR) {
                    self.solution = data['solution'];
                    self.onStarted();
                }
            });
        },

        getStatus: function() {
            var self = this;

            $.ajax({
                url: self.statusURL + self.solution + '/',
                success: function(data, textStatus, jqXHR) {
                    switch (data['status']) {
                        case 0: self.onStatusMissing(); break;
                        case 1: self.onStatusPending(); break;
                        case 2: self.onStatusFailed(); break;
                        case 3: self.onStatusSuccess(); break;
                    }
                }
            });
        },

        update: function() {
            var self = this;

            $.ajax({
                url: self.updateURL + self.solution + '/',
                type: 'post',
                timeout: 30000,
                success: function(data, textStatus, jqXHR) {
                    self.updateQueries = self.updateQueries + 1;
                    switch (data['status']) {
                        case 0: self.onStatusMissing(); break;
                        case 1: self.onStatusPending(); break;
                        case 2: self.onStatusFailed(); break;
                        case 3:
                            self.$bar.css({"width": "75%"});
                            self.$icon.attr('class', 'icon-warning-sign');
                            self.$content.text(self.solveFinalizingMsg);
                            $.ajax({
                                url: self.finalizeURL + self.solution + '/',
                                type: 'post',
                                timeout: 30000,
                                success: function(data, textStatus, jqXHR) {
                                    self.onStatusSuccess();
                                }
                            });
                            break;
                    }
                }
            });
        },

        onStarting: function() {
            this.$root.removeClass('hide');
            this.$content.text(this.beforeSolveMsg);
        },

        onStarted: function() {
            this.onStatusPending();
        },

        onStatusMissing: function() {
            this.solve();
        },

        onStatusPending: function() {
            var self = this;

            self.$icon.attr('class', 'icon-ok');
            self.$bar.css({"width": "50%"});
            self.$content.text(self.solveStartedMsg);

            self.$root.removeClass('hide');
            if (self.updateQueries == 0)
                self.update();
            else
                setTimeout(function() {
                    self.update();
                }, 5000);
        },

        onStatusFailed: function() {
            this.$icon.attr('class', 'icon-fire');
            this.$progress.removeClass('progress-info').addClass('progress-danger');
            this.$bar.css({"width": "100%"});
            this.$content.text(this.solveFailedMsg);
            this.removeStatus();
        },

        onStatusSuccess: function() {
            this.$icon.attr('class', 'icon-ok');
            this.$progress.removeClass('progress-info').addClass('progress-success');
            this.$bar.css({"width": "100%"});
            this.$content.text(this.solveSuccessMsg);
            this.removeStatus();
        },

        removeStatus: function() {
            var self = this;

            setTimeout(function() {
                self.$root.hide('slow');
            }, 5000);
        }
    };

    win.AstroBinPlatesolving = Platesolving;
})(window);

