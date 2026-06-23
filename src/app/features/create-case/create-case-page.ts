import { Component, computed, signal } from '@angular/core';
import {
  debounce,
  disabled,
  form,
  FormField,
  FormRoot,
  max,
  min,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import type { ReconciliationCase } from '../cases/model/reconciliation-case';

type CasePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

interface CreateCaseFormModel {
  reference: string;
  owner: string;
  priority: CasePriority;
  slaHoursRemaining: number;
  description: string;
  requiresManagerReview: boolean;
}

interface CreatedCase extends ReconciliationCase {
  owner: string;
  priority: CasePriority;
  description: string;
  requiresManagerReview: boolean;
}

const INITIAL_CASE_MODEL: CreateCaseFormModel = {
  reference: '',
  owner: '',
  priority: 'NORMAL',
  slaHoursRemaining: 8,
  description: '',
  requiresManagerReview: false,
};

const REFERENCE_PATTERN = /^TXN-\d{4}-\d{3}$/;

@Component({
  selector: 'app-create-case-page',
  imports: [FormField, FormRoot],
  template: `
    <section class="page-heading" aria-labelledby="create-case-title">
      <p class="eyebrow">Case intake</p>
      <h1 id="create-case-title">Create reconciliation case</h1>
      <p>Register a new operational exception with ownership, priority, and SLA context.</p>
    </section>

    <div class="case-intake-layout">
      <form class="case-form" [formRoot]="caseForm" data-testid="create-case-form">
        <div class="form-section">
          <div class="field-group">
            <label for="case-reference">Transaction reference</label>
            <input
              id="case-reference"
              type="text"
              placeholder="TXN-2026-005"
              autocomplete="off"
              [formField]="caseForm.reference"
              data-testid="case-reference"
            />

            @if (shouldShowErrors(caseForm.reference)) {
              <ul class="field-errors" data-testid="reference-errors">
                @for (error of caseForm.reference().errors(); track error.kind) {
                  <li>{{ error.message ?? messageFor(error.kind) }}</li>
                }
              </ul>
            }
          </div>

          <div class="field-group">
            <label for="case-owner">Owner</label>
            <input
              id="case-owner"
              type="text"
              placeholder="Operations analyst"
              autocomplete="off"
              [formField]="caseForm.owner"
              data-testid="case-owner"
            />

            @if (shouldShowErrors(caseForm.owner)) {
              <ul class="field-errors" data-testid="owner-errors">
                @for (error of caseForm.owner().errors(); track error.kind) {
                  <li>{{ error.message ?? messageFor(error.kind) }}</li>
                }
              </ul>
            }
          </div>

          <div class="field-row">
            <div class="field-group">
              <label for="case-priority">Priority</label>
              <select
                id="case-priority"
                [formField]="caseForm.priority"
                data-testid="case-priority"
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div class="field-group">
              <label for="case-sla">SLA hours remaining</label>
              <input
                id="case-sla"
                type="number"
                [formField]="caseForm.slaHoursRemaining"
                data-testid="case-sla"
              />

              @if (shouldShowErrors(caseForm.slaHoursRemaining)) {
                <ul class="field-errors" data-testid="sla-errors">
                  @for (error of caseForm.slaHoursRemaining().errors(); track error.kind) {
                    <li>{{ error.message ?? messageFor(error.kind) }}</li>
                  }
                </ul>
              }
            </div>
          </div>

          <div class="field-group">
            <label for="case-description">Exception summary</label>
            <textarea
              id="case-description"
              rows="5"
              placeholder="Describe why this transaction needs reconciliation review."
              [formField]="caseForm.description"
              data-testid="case-description"
            ></textarea>

            @if (shouldShowErrors(caseForm.description)) {
              <ul class="field-errors" data-testid="description-errors">
                @for (error of caseForm.description().errors(); track error.kind) {
                  <li>{{ error.message ?? messageFor(error.kind) }}</li>
                }
              </ul>
            }
          </div>

          <label class="checkbox-field">
            <input
              type="checkbox"
              [formField]="caseForm.requiresManagerReview"
              data-testid="manager-review"
            />
            <span>
              <strong>Manager review required</strong>
              <small>Enabled only for critical priority cases.</small>
            </span>
          </label>

          @if (shouldShowErrors(caseForm.requiresManagerReview)) {
            <ul class="field-errors" data-testid="manager-review-errors">
              @for (error of caseForm.requiresManagerReview().errors(); track error.kind) {
                <li>{{ error.message ?? messageFor(error.kind) }}</li>
              }
            </ul>
          }
        </div>

        @if (formSubmitted() && caseForm().invalid()) {
          <div class="form-alert" role="alert" data-testid="form-invalid-alert">
            The case intake form has validation issues. Review the highlighted fields.
          </div>
        }

        <div class="form-actions">
          <button
            class="primary-action"
            type="submit"
            [disabled]="caseForm().submitting()"
            data-testid="submit-case"
          >
            @if (caseForm().submitting()) {
              Creating case
            } @else {
              Create case
            }
          </button>

          <button
            class="secondary-action"
            type="button"
            (click)="resetForm()"
            data-testid="reset-case-form"
          >
            Reset
          </button>
        </div>
      </form>

      <aside class="intake-preview" aria-labelledby="preview-title">
        <p class="eyebrow">Live intake state</p>
        <h2 id="preview-title">Current draft</h2>

        <dl>
          <div>
            <dt>Reference</dt>
            <dd>{{ draftSummary().reference }}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{{ draftSummary().owner }}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{{ draftSummary().priority }}</dd>
          </div>
          <div>
            <dt>SLA</dt>
            <dd>{{ draftSummary().sla }}</dd>
          </div>
          <div>
            <dt>Valid</dt>
            <dd>{{ caseForm().valid() ? 'Yes' : 'No' }}</dd>
          </div>
        </dl>

        @if (lastCreatedCase(); as createdCase) {
          <div class="success-panel" data-testid="created-case">
            <strong>{{ createdCase.id }} registered</strong>
            <span>{{ createdCase.reference }} is ready for operational triage.</span>
          </div>
        }
      </aside>
    </div>

    <section class="created-cases" aria-labelledby="created-cases-title">
      <div>
        <p class="eyebrow">Session intake</p>
        <h2 id="created-cases-title">Created cases</h2>
      </div>

      @if (createdCases().length > 0) {
        <div class="created-case-grid" data-testid="created-case-list">
          @for (createdCase of createdCases(); track createdCase.id) {
            <article>
              <span>{{ createdCase.id }}</span>
              <strong>{{ createdCase.reference }}</strong>
              <small>{{ createdCase.owner }} · {{ createdCase.priority }}</small>
            </article>
          }
        </div>
      } @else {
        <div class="empty-state" data-testid="created-case-empty">
          <h3>No cases created in this session</h3>
          <p>Submit a valid intake form to register a local case draft.</p>
        </div>
      }
    </section>

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Signal Forms</h2>
      <p>
        The form model is a writable signal, while validation, disabled state, and submission are
        derived through Angular's Signal Forms field tree.
      </p>
    </section>
  `,
  styleUrl: './create-case-page.css',
})
export class CreateCasePage {
  protected readonly caseModel = signal<CreateCaseFormModel>({ ...INITIAL_CASE_MODEL });
  protected readonly formSubmitted = signal(false);
  protected readonly createdCases = signal<CreatedCase[]>([]);
  protected readonly lastCreatedCase = computed(() => this.createdCases()[0]);

  protected readonly caseForm = form(
    this.caseModel,
    (path) => {
      debounce(path.reference, 250);
      required(path.reference, { message: 'Transaction reference is required.' });
      pattern(path.reference, REFERENCE_PATTERN, {
        error: {
          kind: 'reference-format',
          message: 'Use the TXN-2026-005 format.',
        },
      });

      required(path.owner, { message: 'Owner is required.' });
      minLength(path.owner, 3, {
        error: {
          kind: 'owner-min-length',
          message: 'Owner must contain at least 3 characters.',
        },
      });

      min(path.slaHoursRemaining, 1);
      max(path.slaHoursRemaining, 72);

      required(path.description, { message: 'Exception summary is required.' });
      minLength(path.description, 12, {
        error: {
          kind: 'description-min-length',
          message: 'Exception summary must contain at least 12 characters.',
        },
      });

      disabled(path.requiresManagerReview, (ctx) =>
        ctx.valueOf(path.priority) === 'CRITICAL'
          ? false
          : 'Manager review is only available for critical cases.',
      );

      validate(path.requiresManagerReview, (ctx) => {
        if (ctx.valueOf(path.priority) === 'CRITICAL' && !ctx.value()) {
          return {
            kind: 'manager-review-required',
            message: 'Critical cases require manager review confirmation.',
          };
        }

        return undefined;
      });
    },
    {
      name: 'case-intake',
      submission: {
        action: async () => {
          this.registerCreatedCase();
          this.resetForm();

          return undefined;
        },
        onInvalid: () => {
          this.formSubmitted.set(true);
        },
      },
    },
  );

  protected readonly draftSummary = computed(() => {
    const draft = this.caseModel();

    return {
      reference: draft.reference.trim() || 'Not provided',
      owner: draft.owner.trim() || 'Unassigned',
      priority: draft.priority,
      sla: `${draft.slaHoursRemaining} hours`,
    };
  });

  protected shouldShowErrors(
    field: () => { touched: () => boolean; dirty: () => boolean; invalid: () => boolean },
  ): boolean {
    return (this.formSubmitted() || field().touched() || field().dirty()) && field().invalid();
  }

  protected messageFor(kind: string): string {
    switch (kind) {
      case 'min':
        return 'Value is below the allowed minimum.';
      case 'max':
        return 'Value is above the allowed maximum.';
      case 'required':
        return 'This field is required.';
      default:
        return 'This field is invalid.';
    }
  }

  protected resetForm(): void {
    this.formSubmitted.set(false);
    this.caseModel.set({ ...INITIAL_CASE_MODEL });
  }

  private registerCreatedCase(): void {
    const submittedCase = this.caseModel();
    const nextSequence = this.createdCases().length + 1;

    const createdCase: CreatedCase = {
      id: `CASE-${2000 + nextSequence}`,
      reference: submittedCase.reference.trim(),
      owner: submittedCase.owner.trim(),
      priority: submittedCase.priority,
      status: 'OPEN',
      slaHoursRemaining: submittedCase.slaHoursRemaining,
      description: submittedCase.description.trim(),
      requiresManagerReview:
        submittedCase.priority === 'CRITICAL' && submittedCase.requiresManagerReview,
    };

    this.createdCases.update((currentCases) => [createdCase, ...currentCases]);
  }
}
