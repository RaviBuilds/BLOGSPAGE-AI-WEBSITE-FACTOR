/**
 * Pure gate evaluation engine for M2.2.
 * 
 * Evaluates canonical quality gates without state mutation or persistence.
 * 
 * Canonical sources:
 * - 02-CONTROL-PLANE/quality-gates.md §1-8
 * - 02-CONTROL-PLANE/human-approval.md §1
 * 
 * M2.2 Milestone: Pure gate evaluation library
 * Factory version: 0.2.0
 */

import { State } from '../state/StateMachine';
import { GateName, ValidationResult, CheckFailure, ProblemClass } from './GateTypes';
import { ValidationContext } from './ValidationContext';
import { getGateForTransition, getAllGates } from './GateRegistry';
import { routeFailure } from '../routing/FailureRouter';

/**
 * Pure gate evaluation engine.
 * 
 * Does NOT mutate state, persist results, or execute transitions.
 */
export class GateEvaluator {
  constructor(private context: ValidationContext) {}

  /**
   * Evaluate a transition between states.
   */
  async evaluateTransition(
    projectId: string,
    fromState: State,
    toState: State
  ): Promise<ValidationResult> {
    const gate = getGateForTransition(fromState, toState);
    
    if (!gate) {
      return {
        passed: true,
        gate: null,
        failures: [],
        requiresHumanApproval: false
      };
    }
    
    return this.evaluateGate(projectId, gate.gate, fromState);
  }

  /**
   * Evaluate a specific gate.
   */
  async evaluateGate(
    projectId: string,
    gateName: GateName,
    currentState: State
  ): Promise<ValidationResult> {
    const gates = getAllGates();
    const gate = gates.find(g => g.gate === gateName);
    
    if (!gate) {
      return {
        passed: false,
        gate: gateName,
        failures: [{
          checkId: 'unknown_gate',
          checkName: 'Gate not implemented',
          canonicalSource: 'N/A',
          reason: `Gate ${gateName} is not implemented`,
          blocking: true,
          problemClass: undefined
        }],
        requiresHumanApproval: false
      };
    }
    
    const artifactFailures = await this.checkArtifacts(projectId, gate);
    const checkFailures = await this.evaluateChecks(projectId, gate);
    const allFailures = [...artifactFailures, ...checkFailures];
    const passed = allFailures.length === 0;
    
    const result: ValidationResult = {
      passed,
      gate: gateName,
      failures: allFailures,
      requiresHumanApproval: gate.requiresHumanApprovalAfter,
      humanGate: gate.humanGateAfter,
      gateOwner: gate.owner
    };
    
    if (!passed) {
      const dominantProblemClass = this.classifyDominantProblem(allFailures);
      const routing = routeFailure(dominantProblemClass, currentState);
      
      result.problemClass = dominantProblemClass;
      result.recommendedRoute = routing.targetState;
      result.returnTarget = routing.returnTarget;
    }
    
    return result;
  }

  private async checkArtifacts(
    projectId: string,
    gate: ReturnType<typeof getAllGates>[0]
  ): Promise<CheckFailure[]> {
    const failures: CheckFailure[] = [];
    
    for (const artifactType of gate.requiredArtifacts) {
      const exists = await this.context.hasArtifact(projectId, artifactType);
      
      if (!exists) {
        failures.push({
          checkId: `artifact_${artifactType.toLowerCase()}`,
          checkName: `Required artifact: ${artifactType}`,
          canonicalSource: gate.canonicalSource,
          reason: `Required artifact ${artifactType} does not exist`,
          blocking: true,
          problemClass: undefined
        });
      }
    }
    
    return failures;
  }

  private async evaluateChecks(
    projectId: string,
    gate: ReturnType<typeof getAllGates>[0]
  ): Promise<CheckFailure[]> {
    const failures: CheckFailure[] = [];
    
    for (const check of gate.checks) {
      try {
        const result = await check.evaluate(projectId, this.context);
        
        if (!result.passed) {
          failures.push({
            checkId: check.id,
            checkName: check.name,
            canonicalSource: check.canonicalSource,
            reason: result.reason || 'Check failed',
            blocking: check.blocking,
            problemClass: check.problemClass
          });
        }
      } catch (error) {
        failures.push({
          checkId: check.id,
          checkName: check.name,
          canonicalSource: check.canonicalSource,
          reason: `Check evaluation error: ${error instanceof Error ? error.message : String(error)}`,
          blocking: true,
          problemClass: check.problemClass
        });
      }
    }
    
    return failures;
  }

  private classifyDominantProblem(failures: CheckFailure[]): ProblemClass {
    const blockingFailures = failures.filter(f => f.blocking);
    const failuresToClassify = blockingFailures.length > 0 ? blockingFailures : failures;
    
    for (const failure of failuresToClassify) {
      if (failure.problemClass) {
        return failure.problemClass;
      }
    }
    
    return ProblemClass.UNCLEAR;
  }
}
