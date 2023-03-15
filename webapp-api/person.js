export class Person {
    constructor(height, weight) {
        this.height = height;
        this.weight = weight;
    }

    withImc() {
        this.imc = this.weight / (this.height ** 2);
        
        return this;
    }

    withImcDescription() {
        if (this.imc < 18.5) this.imcDescription = "magreza";
        else if (this.imc <= 24.9) this.imcDescription = "normal";
        else if (this.imc <= 29.9) this.imcDescription = "sobrepeso";
        else this.imcDescription = "obesidade";

        return this;
    }
}
