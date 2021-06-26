import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { PaisesServiceService } from '../services/paises-service.service';
import { paisSmall } from '../interfaces/paises.interface';
import { switchMap, tap } from "rxjs/operators";


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region   : ['', Validators.required],
    pais     : ['', Validators.required],
    frontera : [{ value: '', disable: true}, Validators.required]
  });


  //lenar selectores
  regiones  : string[] = [];
  paises    : paisSmall[] = [];
  // fronteras : string [] = [];
  fronteras : paisSmall[] = [];


  //UI
  cargando: boolean = false;
  constructor( private fb: FormBuilder,
               private paisesService: PaisesServiceService) { }



  ngOnInit(): void {
    //Cuando cambie la región
    this.regiones = this.paisesService.regiones;  
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( _ =>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region )),
    )
    .subscribe( paises => {
      this.cargando = false;
      this.paises = paises;
    })



    //Cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( ()=>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      } ),
      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
      switchMap ( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ))
    )
    .subscribe( paises =>{
      // this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;
    })





    // cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    // .subscribe( region => {
    //   console.log( region )

    //   this.paisesService.getPaisesPorRegion( region )
    //   .subscribe( paises => {
    //     console.log(paises);
    //     this.paises = paises;
    //   }, (err) =>{
    //     console.log(err)
    //   });

    // })
  }


  guardar() {
    console.log(this.miFormulario.value)
  }

}
