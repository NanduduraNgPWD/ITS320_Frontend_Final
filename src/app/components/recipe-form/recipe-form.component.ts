import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  author: string;
  category: string;
  tags: string[];
}

interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
  group?: string;
}

interface Instruction {
  step: number;
  text: string;
  image?: string;
}

@Component({
  selector: 'recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html'

})
export class RecipeFormComponent {
  private fb = FormBuilder;

  currentStep = signal(1);
  totalSteps = 7;

  stepTitles = ['Details', 'Ingredients', 'Instructions', 'Timing', 'Images', 'Review', 'Submit'];

  tags = signal<string[]>([]);
  newTag = '';
  imagePreview = signal<string | null>(null);
  submissionStatus = signal<'success' | 'error' | null>(null);
  submissionMessage = signal<string>('');

  recipeForm: FormGroup;

  constructor() {
    this.recipeForm = new FormBuilder().group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      ingredients: new FormBuilder().array([]),
      instructions: new FormBuilder().array([]),
      prepTime: [0, [Validators.required, Validators.min(0)]],
      cookTime: [0, [Validators.required, Validators.min(0)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      author: ['', Validators.required],
      image: ['']
    });

    // Add initial ingredient and instruction
    this.addIngredient();
    this.addInstruction();
  }

  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructionsArray() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  progressPercentage = computed(() => {
    return (this.currentStep() / this.totalSteps) * 100;
  });

  addTag() {
    if (this.newTag.trim() && !this.tags().includes(this.newTag.trim())) {
      this.tags.update(tags => [...tags, this.newTag.trim()]);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.update(tags => tags.filter((_, i) => i !== index));
  }

  addIngredient() {
    const ingredientGroup = new FormBuilder().group({
      quantity: ['', Validators.required],
      unit: [''],
      name: ['', Validators.required],
      group: ['']
    });
    this.ingredientsArray.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  addInstruction() {
    const instructionGroup = new FormBuilder().group({
      step: [this.instructionsArray.length + 1],
      text: ['', Validators.required],
      image: ['']
    });
    this.instructionsArray.push(instructionGroup);
  }

  removeInstruction(index: number) {
    this.instructionsArray.removeAt(index);
    // Update step numbers
    this.instructionsArray.controls.forEach((control, i) => {
      control.get('step')?.setValue(i + 1);
    });
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
        this.recipeForm.get('image')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview.set(null);
    this.recipeForm.get('image')?.setValue('');
  }

  canProceed(): boolean {
    switch (this.currentStep()) {
      case 1:
        return !!(this.recipeForm.get('title')?.valid &&
          this.recipeForm.get('description')?.valid &&
          this.recipeForm.get('category')?.valid);
      case 2:
        return this.ingredientsArray.length > 0 &&
          this.ingredientsArray.controls.every(control =>
            !!(control.get('quantity')?.valid && control.get('name')?.valid)
          );
      case 3:
        return this.instructionsArray.length > 0 &&
          this.instructionsArray.controls.every(control =>
            !!control.get('text')?.valid
          );
      case 4:
        return !!(this.recipeForm.get('prepTime')?.valid &&
          this.recipeForm.get('cookTime')?.valid &&
          this.recipeForm.get('servings')?.valid);
      case 5:
        return true; // Image is optional
      case 6:
        return !!this.recipeForm.get('author')?.valid;
      default:
        return true;
    }
  }

  nextStep() {
    if (this.canProceed() && this.currentStep() < this.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  saveAsDraft() {
    const recipeData = this.buildRecipeData();
    console.log('Saving as draft:', recipeData);

    // Simulate API call
    setTimeout(() => {
      this.submissionStatus.set('success');
      this.submissionMessage.set('Recipe saved as draft successfully!');
    }, 1000);
  }

  publishRecipe() {
    const recipeData = this.buildRecipeData();
    console.log('Publishing recipe:', recipeData);

    // Simulate API call
    setTimeout(() => {
      this.submissionStatus.set('success');
      this.submissionMessage.set('Recipe published successfully!');
    }, 1000);
  }

  private buildRecipeData(): Recipe {
    const formValue = this.recipeForm.value;
    return {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      tags: this.tags(),
      ingredients: formValue.ingredients,
      instructions: formValue.instructions,
      prepTime: formValue.prepTime,
      cookTime: formValue.cookTime,
      servings: formValue.servings,
      author: formValue.author,
      image: formValue.image
    };
  }
}