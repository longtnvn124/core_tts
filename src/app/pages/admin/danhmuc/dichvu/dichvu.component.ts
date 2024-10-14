import {Component, OnInit} from '@angular/core';
import {DmLoaiVanbanService} from "@service/thuctapsinh/dm-loai-vanban.service";
import {NotificationService} from "@appNotification";

export interface DmLoaiVanBan{
  id?:number;
  title:string;
  status:number;
}

@Component({
  selector: 'app-dichvu',
  templateUrl: './dichvu.component.html',
  styleUrls: ['./dichvu.component.css']
})
export class DichvuComponent implements OnInit{


  constructor(private dmLoaiVanbanService: DmLoaiVanbanService,
              private notifi:NotificationService) {
  }
  ngOnInit(): void {
  }

  id:number = 0;
  btrCreate(){
    this.dmLoaiVanbanService.add({title:'loại 1', status:0}).subscribe({
      next:(id)=>{
        console.log(id);
        this.id = id;
        this.notifi.toastSuccess('Taj nowis thanh cong');

      },
      error:(e)=>{
        this.notifi.toastError('Taj nowis ko thanh cong');
      }
    })
}
  btrUpdate(){
    this.dmLoaiVanbanService.update( 1,{title:'loại 2', status:0}).subscribe({
      next:(id)=>{
        console.log(id);
        this.id = id;
        this.notifi.toastSuccess('capnhat nowis thanh cong');

      },
      error:(e)=>{
        this.notifi.toastError('capnhat nowis ko thanh cong');
      }
    })
}
  btrDelele(){
    this.dmLoaiVanbanService.delete( 1).subscribe({
      next:(id)=>{
        console.log(id);
        this.id = id;
        this.notifi.toastSuccess('xoa nowis thanh cong');

      },
      error:(e)=>{
        this.notifi.toastError('xoa nowis ko thanh cong');
      }
    })
}

}
