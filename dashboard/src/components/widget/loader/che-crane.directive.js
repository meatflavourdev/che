/*
 * Copyright (c) 2015-2016 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';

/**
 * Defines a directive for creating Loader
 * @author Oleksii Kurinnyi
 */
export class CheLoaderCrane {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor() {
    this.restrict = 'E';
    this.replace = true;
    this.templateUrl = 'components/widget/loader/che-crane.html';

    // scope values
    this.scope = {
      step: '@cheStep',
      allSteps: '=cheAllSteps',
      excludeSteps: '=cheExcludeSteps',
      switchOnIteration: '=?cheSwitchOnIteration'
    };
  }

  link($scope, element) {
    let craneEl = element.find('.crane'),
    // let craneEl = angular.element(document).find('.crane'),
      cargoEl = element.find('#load'),
      oldSteps = [],
      newStep,
      animationStopping = false,
      animationRunning = false;

    $scope.$watch(() => {
      return $scope.step;
    }, (newVal) => {
      newVal = parseInt(newVal, 10);

      // try to stop animation on last step
      if (newVal === $scope.allSteps.length - 1) {
        animationStopping = true;

        if (!$scope.switchOnIteration) {
          // stop animation immediately if it shouldn't wait untill next iteration
          setNoAnimation();
        }
      }

      // skip steps excluded
      if ($scope.excludeSteps.indexOf(newVal) !== -1) {
        return;
      }

      newStep = newVal;

      // go to next step
      // if animation hasn't run yet or it shouldn't wait untill next iteration
      if (!animationRunning || !$scope.switchOnIteration) {
        setAnimation();
        setCurrentStep();
      }

      if (oldSteps.indexOf(newVal) === -1) {
        oldSteps.push(newVal);
      }
    });

    if (!!$scope.switchOnIteration) {
      element.find('.anim.trolley-block').bind('animationstart', () => {
        animationRunning = true;
      });
      element.find('.anim.trolley-block').bind('animationiteration', () => {
        setCurrentStep();
        if (animationStopping) {
          setNoAnimation();
        }
      });
    }

    let setAnimation = () => {
        craneEl.removeClass('no-anim');
      },
      setNoAnimation = () => {
        animationRunning = false;
        craneEl.addClass('no-anim');
      },
      setCurrentStep = () => {
        for (let i = 0; i < oldSteps.length; i++) {
          craneEl.removeClass('step-' + oldSteps[i]);
          cargoEl.removeClass('layer-' + oldSteps[i]);
        }
        oldSteps.length = 0;

        craneEl.addClass('step-' + newStep);
        cargoEl.addClass('layer-' + newStep);
      }
  }

}
